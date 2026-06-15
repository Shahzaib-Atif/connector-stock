export interface LineStatusContext {
  enc: string;
  line: number;
  originalConnector?: string;
}

export interface UpdateConnNameOptions {
  skipCacheRefresh?: boolean;
}
