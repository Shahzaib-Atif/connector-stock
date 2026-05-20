import { AnaliseTabDto } from "./AnaliseTabDto";

export interface AnaliseTabPageDto {
  items: AnaliseTabDto[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  lastRefreshedAt: string | null;
  isRefreshing: boolean;
}
