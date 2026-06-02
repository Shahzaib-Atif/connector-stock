export interface LineStatusContext {
  enc: string;
  line: string | number;
}

export interface UpdateConnNameOptions {
  skipCacheRefresh?: boolean;
  skipDivDeskLaunch?: boolean;
}
