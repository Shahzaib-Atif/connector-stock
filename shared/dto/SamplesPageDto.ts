import { SamplesDto } from "./SamplesDto";

export interface SamplesPageDto {
  items: SamplesDto[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  lastRefreshedAt: string | null;
  isRefreshing: boolean;
  projects: string[];
  clients: string[];
  entregueOptions: string[];
}
