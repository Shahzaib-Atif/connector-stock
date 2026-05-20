import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SamplesRepo } from 'src/repository/samples.repo';
import { JsonCacheService } from 'src/cache/json-cache.service';
import { AnaliseTabDto } from '@shared/dto/AnaliseTabDto';
import { AnaliseTabQueryDto } from '@shared/dto/AnaliseTabQueryDto';
import { AnaliseTabPageDto } from '@shared/dto/AnaliseTabPageDto';
import {
  compareNullableValues,
  containsInsensitive,
  paginateItems,
} from 'src/utils/table-query.utils';

interface AnaliseCacheMeta {
  lastRefreshedAt: string;
  rowCount: number;
  refreshReason: string;
}

interface CachedAnaliseDataset {
  rows: AnaliseTabDto[];
  meta: AnaliseCacheMeta | null;
}

type AnaliseSortField =
  | 'Encomenda'
  | 'NumLinha'
  | 'Estado'
  | 'Descricao'
  | 'Conector'
  | 'RefCliente'
  | 'Cliente'
  | 'DataAbertura'
  | 'DataEntrega'
  | 'CDU_ProjetoCliente';

interface NormalizedAnaliseQuery {
  page: number;
  pageSize: number;
  sortBy: AnaliseSortField;
  sortDirection: 'asc' | 'desc';
  filters: {
    encomenda: string;
    numLinha: string;
    estado: string;
    descricao: string;
    conector: string;
    refCliente: string;
    cliente: string;
    projeto: string;
  };
}

const DATA_KEY = 'analise-tab:data:v1';
const META_KEY = 'analise-tab:meta:v1';
const MAX_PAGE_SIZE = 100;
const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

@Injectable()
export class AnaliseCacheService implements OnModuleInit {
  private readonly logger = new Logger(AnaliseCacheService.name);
  private refreshPromise: Promise<CachedAnaliseDataset> | null = null;

  constructor(
    private readonly cacheService: JsonCacheService,
    private readonly samplesRepo: SamplesRepo,
  ) {}

  onModuleInit() {
    void this.runRefresh('startup');
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyRefresh() {
    void this.runRefresh('hourly-cron');
  }

  // Returns cached data, refreshing first if missing or stale
  private async ensureDataset(): Promise<CachedAnaliseDataset> {
    const dataset = await this.readDataset();

    if (!dataset) {
      // Cache miss — fetch and wait before serving
      return this.runRefresh('initial-request');
    } else if (this.isStale(dataset.meta?.lastRefreshedAt)) {
      // Stale data — serve it and refresh in background
      void this.runRefresh('stale-request');
    }
    return dataset;
  }

  private filterRows(rows: AnaliseTabDto[], query: NormalizedAnaliseQuery) {
    return rows.filter(
      (row) =>
        containsInsensitive(row.Encomenda, query.filters.encomenda) &&
        containsInsensitive(row.NumLinha, query.filters.numLinha) &&
        containsInsensitive(row.Estado, query.filters.estado) &&
        containsInsensitive(row.Descricao, query.filters.descricao) &&
        containsInsensitive(row.Conector, query.filters.conector) &&
        containsInsensitive(row.RefCliente, query.filters.refCliente) &&
        containsInsensitive(row.Cliente, query.filters.cliente) &&
        containsInsensitive(row.CDU_ProjetoCliente, query.filters.projeto),
    );
  }

  private sortRows(rows: AnaliseTabDto[], query: NormalizedAnaliseQuery) {
    return [...rows].sort((left, right) =>
      compareNullableValues(
        left[query.sortBy],
        right[query.sortBy],
        query.sortDirection,
      ),
    );
  }

  // allows manual trigger of cache refresh via API without waiting for the hourly cron
  async getPage(queryDto: AnaliseTabQueryDto): Promise<AnaliseTabPageDto> {
    const query = normalizeAnaliseQuery(queryDto);
    const dataset = await this.ensureDataset();
    const filteredRows = this.filterRows(dataset.rows, query);
    const sortedRows = this.sortRows(filteredRows, query);

    const page = paginateItems(sortedRows, query.page, query.pageSize);

    return {
      ...page,
      lastRefreshedAt: dataset.meta?.lastRefreshedAt ?? null,
      isRefreshing: this.refreshPromise !== null,
    };
  }

  // Gets all AnaliseTab rows for a RefCliente without pagination (used in sample creation wizard)
  async getByRefCliente(refCliente: string): Promise<AnaliseTabDto[]> {
    const dataset = await this.ensureDataset();

    // Use a Map to deduplicate rows by the combination of Encomenda, Conector, Cliente, and RefCliente
    const uniqueRows = new Map<string, AnaliseTabDto>();
    for (const row of dataset.rows) {
      if (!containsInsensitive(row.RefCliente, refCliente)) continue;

      const key = [
        row.Encomenda,
        row.Conector,
        row.Cliente,
        row.RefCliente,
      ].join('|');
      if (!uniqueRows.has(key)) {
        uniqueRows.set(key, row);
      }
    }

    return [...uniqueRows.values()].sort((left, right) =>
      compareNullableValues(left.DataAbertura, right.DataAbertura, 'desc'),
    );
  }

  // allows manual trigger of cache refresh via API without waiting for the hourly cron
  async runRefresh(reason: string) {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Fire-and-forget background refresh; stale data is served until it completes
    this.refreshPromise = this.refreshAndPersist(reason).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  // Manually triggers cache refresh and clears existing cache.
  async invalidateAndRefresh(reason: string) {
    await this.cacheService.delete(DATA_KEY);
    await this.cacheService.delete(META_KEY);
    void this.runRefresh(reason);

    return { accepted: true };
  }

  // Refreshes dataset from DB and updates cache with refresh metadata
  private async refreshAndPersist(
    reason: string,
  ): Promise<CachedAnaliseDataset> {
    this.logger.log(`Refreshing AnaliseTab cache. Reason: ${reason}`);
    const rows = await this.samplesRepo.getAnaliseTab();
    const meta: AnaliseCacheMeta = {
      lastRefreshedAt: new Date().toISOString(),
      rowCount: rows.length,
      refreshReason: reason,
    };

    await Promise.all([
      this.cacheService.set(DATA_KEY, rows),
      this.cacheService.set(META_KEY, meta),
    ]);

    return { rows, meta };
  }

  // Reads the cached dataset and its metadata. Returns null if no cached data is available.
  private async readDataset(): Promise<CachedAnaliseDataset | null> {
    const [rows, meta] = await Promise.all([
      this.cacheService.get<AnaliseTabDto[]>(DATA_KEY),
      this.cacheService.get<AnaliseCacheMeta>(META_KEY),
    ]);

    if (!rows?.length) {
      return null;
    }

    return {
      rows,
      meta: meta ?? null,
    };
  }

  private isStale(lastRefreshedAt?: string | null) {
    if (!lastRefreshedAt) {
      return true;
    }

    return (
      Date.now() - new Date(lastRefreshedAt).getTime() >= REFRESH_INTERVAL_MS
    );
  }
}

// Normalizes and validates AnaliseTab query params with defaults and constraints
function normalizeAnaliseQuery(
  query: AnaliseTabQueryDto,
): NormalizedAnaliseQuery {
  const sortBy = normalizeSortBy(query.sortBy);
  const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

  return {
    page: normalizePositiveInt(query.page, 1),
    pageSize: Math.min(normalizePositiveInt(query.pageSize, 10), MAX_PAGE_SIZE),
    sortBy,
    sortDirection,
    filters: {
      encomenda: query.encomenda ?? '',
      numLinha: query.numLinha ?? '',
      estado: query.estado ?? '',
      descricao: query.descricao ?? '',
      conector: query.conector ?? '',
      refCliente: query.refCliente ?? '',
      cliente: query.cliente ?? '',
      projeto: query.projeto ?? '',
    },
  };
}

// Ensures a value is a positive integer, otherwise returns the fallback default
function normalizePositiveInt(
  value: string | number | undefined,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

// Validates and normalizes the sortBy field, defaulting to 'DataAbertura' if invalid
function normalizeSortBy(value?: string): AnaliseSortField {
  const allowed: AnaliseSortField[] = [
    'Encomenda',
    'NumLinha',
    'Estado',
    'Descricao',
    'Conector',
    'RefCliente',
    'Cliente',
    'DataAbertura',
    'DataEntrega',
    'CDU_ProjetoCliente',
  ];

  return allowed.includes(value as AnaliseSortField)
    ? (value as AnaliseSortField)
    : 'DataAbertura';
}
