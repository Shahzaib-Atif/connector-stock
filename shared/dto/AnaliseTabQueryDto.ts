export class AnaliseTabQueryDto {
  page?: number | string;
  pageSize?: number | string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  encomenda?: string;
  numLinha?: string;
  estado?: string;
  descricao?: string;
  conector?: string;
  refCliente?: string;
  cliente?: string;
  projeto?: string;
}
