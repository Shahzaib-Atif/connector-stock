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

  // Warms analise cache when the module starts.
  onModuleInit() {
    void this.runRefresh('startup');
  }

  // Refreshes analise cache every hour via cron.
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM)
  handleHourlyRefresh() {
    void this.runRefresh('daily-cron');
  }

  // Loads cache, refreshing when missing or stale.
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

  // Applies case-insensitive filters to cached rows.
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

  // Sorts rows using the requested field and direction.
  private sortRows(rows: AnaliseTabDto[], query: NormalizedAnaliseQuery) {
    return [...rows].sort((left, right) =>
      compareNullableValues(
        left[query.sortBy],
        right[query.sortBy],
        query.sortDirection,
      ),
    );
  }

  // Returns filtered, sorted, paginated analise rows.
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

  // Returns cached rows sharing order, status, client, project.
  async getSimilarRows(query: {
    encomenda: string;
    numLinha: number;
    estado?: string | null;
    cliente?: string | null;
    cduProjetoCliente?: string | null;
    newConnector?: string;
  }): Promise<AnaliseTabDto[]> {
    const dataset = await this.ensureDataset();
    const normalizedNewConnector = query.newConnector?.trim().toLowerCase();

    return dataset.rows.filter((row) => {
      if (row.NumLinha === query.numLinha) return false;
      if (!matchesSimilarityKey(row, query)) return false;

      if (normalizedNewConnector) {
        const current = (row.Conector ?? '').trim().toLowerCase();
        if (current === normalizedNewConnector) return false;
      }

      return true;
    });
  }

  // Returns unique analise rows for one RefCliente.
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

  // Refreshes analise cache from the database.
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

  // Clears analise cache then triggers a refresh.
  async invalidateAndRefresh(reason: string) {
    await this.cacheService.delete(DATA_KEY);
    await this.cacheService.delete(META_KEY);
    void this.runRefresh(reason);

    return { accepted: true };
  }

  // Reloads analise rows from DB into JSON cache.
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

  // Reads cached analise rows and metadata from storage.
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

  // True when cache age exceeds the refresh interval.
  private isStale(lastRefreshedAt?: string | null) {
    if (!lastRefreshedAt) {
      return true;
    }

    return (
      Date.now() - new Date(lastRefreshedAt).getTime() >= REFRESH_INTERVAL_MS
    );
  }
}

// Normalizes analise list query params and defaults.
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

// Parses a positive integer or returns fallback.
function normalizePositiveInt(
  value: string | number | undefined,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

// True when row matches order, status, client, project keys.
function matchesSimilarityKey(
  row: AnaliseTabDto,
  query: {
    encomenda: string;
    estado?: string | null;
    cliente?: string | null;
    cduProjetoCliente?: string | null;
  },
) {
  return (
    normalizeField(row.Encomenda) === normalizeField(query.encomenda) &&
    normalizeField(row.Estado) === normalizeField(query.estado) &&
    normalizeField(row.Cliente) === normalizeField(query.cliente) &&
    normalizeField(row.CDU_ProjetoCliente) ===
      normalizeField(query.cduProjetoCliente)
  );
}

// Trims nullable string fields for comparisons.
function normalizeField(value: string | null | undefined) {
  return (value ?? '').trim();
}

// Validates sort field or defaults to DataAbertura.
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
