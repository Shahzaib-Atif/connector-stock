import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SamplesRepo } from 'src/repository/samples.repo';
import { JsonCacheService } from 'src/cache/json-cache.service';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { SamplesQueryDto } from '@shared/dto/SamplesQueryDto';
import { SamplesPageDto } from '@shared/dto/SamplesPageDto';
import { SamplesOptionsDto } from '@shared/dto/SamplesOptionsDto';
import { RegAmostrasOrcDto } from '@shared/dto/RegAmostrasOrcDto';
import {
  compareNullableValues,
  containsInsensitive,
  paginateItems,
} from 'src/utils/table-query.utils';

interface SamplesCacheMeta {
  lastRefreshedAt: string;
  rowCount: number;
  refreshReason: string;
  projects: string[];
  clients: string[];
  entregueOptions: string[];
}

interface CachedSamplesDataset {
  rows: SamplesDto[];
  meta: SamplesCacheMeta | null;
}

interface CachedOrcDataset {
  rows: RegAmostrasOrcDto[];
  meta: SamplesCacheMeta | null;
}

type SamplesSortField =
  | 'ID'
  | 'Cliente'
  | 'Projeto'
  | 'EncDivmac'
  | 'Ref_Descricao'
  | 'Amostra'
  | 'NumORC'
  | 'N_Envio'
  | 'Entregue_a'
  | 'Data_recepcao';

interface NormalizedSamplesQuery {
  page: number;
  pageSize: number;
  sortBy: SamplesSortField;
  sortDirection: 'asc' | 'desc';
  filters: {
    idQuery: string;
    cliente: string;
    projeto: string;
    encDivmac: string;
    refDescricao: string;
    amostra: string;
    numORC: string;
    nEnvio: string;
    entregueA: string;
  };
}

const DATA_KEY = 'samples:data:v1';
const META_KEY = 'samples:meta:v1';
const ORC_DATA_KEY = 'samples:orc:data:v1';
const ORC_META_KEY = 'samples:orc:meta:v1';
const MAX_PAGE_SIZE = 100;
const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

@Injectable()
export class SamplesCacheService implements OnModuleInit {
  private readonly logger = new Logger(SamplesCacheService.name);
  private refreshPromise: Promise<CachedSamplesDataset> | null = null;
  private orcRefreshPromise: Promise<CachedOrcDataset> | null = null;

  constructor(
    private readonly cacheService: JsonCacheService,
    private readonly samplesRepo: SamplesRepo,
  ) {}

  onModuleInit() {
    void this.runRefresh('startup');
    void this.runOrcRefresh('startup');
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyRefresh() {
    void this.runRefresh('hourly-cron');
    void this.runOrcRefresh('hourly-cron');
  }

  async getPage(queryDto: SamplesQueryDto): Promise<SamplesPageDto> {
    const query = normalizeSamplesQuery(queryDto);
    const dataset = await this.ensureDataset();
    const filteredRows = this.filterRows(dataset.rows, query);
    const sortedRows = this.sortRows(filteredRows, query);
    const page = paginateItems(sortedRows, query.page, query.pageSize);

    return {
      ...page,
      lastRefreshedAt: dataset.meta?.lastRefreshedAt ?? null,
      isRefreshing: this.refreshPromise !== null,
      projects: dataset.meta?.projects ?? [],
      clients: dataset.meta?.clients ?? [],
      entregueOptions: dataset.meta?.entregueOptions ?? [],
    };
  }

  async getOptions(): Promise<SamplesOptionsDto> {
    const dataset = await this.ensureDataset();

    return {
      projects: dataset.meta?.projects ?? [],
      clients: dataset.meta?.clients ?? [],
      entregueOptions: dataset.meta?.entregueOptions ?? [],
      lastRefreshedAt: dataset.meta?.lastRefreshedAt ?? null,
    };
  }

  async getAllOrc(): Promise<RegAmostrasOrcDto[]> {
    const dataset = await this.ensureOrcDataset();
    return dataset.rows;
  }

  async searchOrc(query: string): Promise<RegAmostrasOrcDto[]> {
    const dataset = await this.ensureOrcDataset();
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return dataset.rows.filter(
      (row) =>
        row.orcDoc.toLowerCase().includes(search) ||
        row.CDU_ModuloRefCliente.toLowerCase().includes(search),
    );
  }

  async invalidateAndRefresh(reason: string) {
    await this.cacheService.delete(DATA_KEY);
    await this.cacheService.delete(META_KEY);
    void this.runRefresh(reason);

    return { accepted: true };
  }

  async invalidateOrcAndRefresh(reason: string) {
    await this.cacheService.delete(ORC_DATA_KEY);
    await this.cacheService.delete(ORC_META_KEY);
    void this.runOrcRefresh(reason);

    return { accepted: true };
  }

  private async ensureDataset(): Promise<CachedSamplesDataset> {
    const dataset = await this.readDataset();

    if (!dataset) {
      return this.runRefresh('initial-request');
    }

    if (this.isStale(dataset.meta?.lastRefreshedAt)) {
      void this.runRefresh('stale-request');
    }

    return dataset;
  }

  private async ensureOrcDataset(): Promise<CachedOrcDataset> {
    const dataset = await this.readOrcDataset();

    if (!dataset) {
      return this.runOrcRefresh('initial-request');
    }

    if (this.isStale(dataset.meta?.lastRefreshedAt)) {
      void this.runOrcRefresh('stale-request');
    }

    return dataset;
  }

  private filterRows(rows: SamplesDto[], query: NormalizedSamplesQuery) {
    return rows.filter(
      (row) =>
        containsInsensitive(row.ID, query.filters.idQuery) &&
        containsInsensitive(row.Cliente, query.filters.cliente) &&
        containsInsensitive(row.Projeto, query.filters.projeto) &&
        containsInsensitive(row.EncDivmac, query.filters.encDivmac) &&
        containsInsensitive(row.Ref_Descricao, query.filters.refDescricao) &&
        containsInsensitive(row.Amostra, query.filters.amostra) &&
        containsInsensitive(row.NumORC, query.filters.numORC) &&
        containsInsensitive(row.N_Envio, query.filters.nEnvio) &&
        containsInsensitive(row.Entregue_a, query.filters.entregueA),
    );
  }

  private sortRows(rows: SamplesDto[], query: NormalizedSamplesQuery) {
    return [...rows].sort((left, right) =>
      compareNullableValues(
        left[query.sortBy],
        right[query.sortBy],
        query.sortDirection,
      ),
    );
  }

  async runRefresh(reason: string) {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshAndPersist(reason).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  async runOrcRefresh(reason: string) {
    if (this.orcRefreshPromise) {
      return this.orcRefreshPromise;
    }

    this.orcRefreshPromise = this.refreshOrcAndPersist(reason).finally(() => {
      this.orcRefreshPromise = null;
    });

    return this.orcRefreshPromise;
  }

  private async refreshAndPersist(
    reason: string,
  ): Promise<CachedSamplesDataset> {
    this.logger.log(`Refreshing Samples cache. Reason: ${reason}`);
    const rows = await this.samplesRepo.getAllSamples();

    const projects = new Set<string>();
    const clients = new Set<string>();
    const entregueOptions = new Set<string>();

    for (const row of rows) {
      if (row.Projeto) projects.add(row.Projeto);
      if (row.Cliente) clients.add(row.Cliente);
      if (row.Entregue_a) entregueOptions.add(row.Entregue_a);
    }

    const meta: SamplesCacheMeta = {
      lastRefreshedAt: new Date().toISOString(),
      rowCount: rows.length,
      refreshReason: reason,

      projects: [...projects].sort(),
      clients: [...clients].sort(),
      entregueOptions: [...entregueOptions].sort(),
    };

    await Promise.all([
      this.cacheService.set(DATA_KEY, rows),
      this.cacheService.set(META_KEY, meta),
    ]);

    return { rows, meta };
  }

  private async refreshOrcAndPersist(
    reason: string,
  ): Promise<CachedOrcDataset> {
    this.logger.log(`Refreshing ORC samples cache. Reason: ${reason}`);
    const rows = await this.samplesRepo.getAllSamplesFromORC();
    const meta: SamplesCacheMeta = {
      lastRefreshedAt: new Date().toISOString(),
      rowCount: rows.length,
      refreshReason: reason,
      projects: [],
      clients: [],
      entregueOptions: [],
    };

    await Promise.all([
      this.cacheService.set(ORC_DATA_KEY, rows),
      this.cacheService.set(ORC_META_KEY, meta),
    ]);

    return { rows, meta };
  }

  private async readDataset(): Promise<CachedSamplesDataset | null> {
    const [rows, meta] = await Promise.all([
      this.cacheService.get<SamplesDto[]>(DATA_KEY),
      this.cacheService.get<SamplesCacheMeta>(META_KEY),
    ]);

    if (!rows?.length) {
      return null;
    }

    return {
      rows,
      meta: meta ?? null,
    };
  }

  private async readOrcDataset(): Promise<CachedOrcDataset | null> {
    const [rows, meta] = await Promise.all([
      this.cacheService.get<RegAmostrasOrcDto[]>(ORC_DATA_KEY),
      this.cacheService.get<SamplesCacheMeta>(ORC_META_KEY),
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

function normalizeSamplesQuery(query: SamplesQueryDto): NormalizedSamplesQuery {
  const sortBy = normalizeSortBy(query.sortBy);
  const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

  return {
    page: normalizePositiveInt(query.page, 1),
    pageSize: Math.min(normalizePositiveInt(query.pageSize, 10), MAX_PAGE_SIZE),
    sortBy,
    sortDirection,
    filters: {
      idQuery: query.idQuery ?? '',
      cliente: query.cliente ?? '',
      projeto: query.projeto ?? '',
      encDivmac: query.encDivmac ?? '',
      refDescricao: query.refDescricao ?? '',
      amostra: query.amostra ?? '',
      numORC: query.numORC ?? '',
      nEnvio: query.nEnvio ?? '',
      entregueA: query.entregueA ?? '',
    },
  };
}

function normalizePositiveInt(
  value: string | number | undefined,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function normalizeSortBy(value?: string): SamplesSortField {
  const allowed: SamplesSortField[] = [
    'ID',
    'Cliente',
    'Projeto',
    'EncDivmac',
    'Ref_Descricao',
    'Amostra',
    'NumORC',
    'N_Envio',
    'Entregue_a',
    'Data_recepcao',
  ];

  return allowed.includes(value as SamplesSortField)
    ? (value as SamplesSortField)
    : 'ID';
}
