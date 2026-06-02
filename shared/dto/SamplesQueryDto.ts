export class SamplesQueryDto {
  page?: number | string;
  pageSize?: number | string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  idQuery?: string;
  cliente?: string;
  projeto?: string;
  encDivmac?: string;
  refDescricao?: string;
  amostra?: string;
  numORC?: string;
  nEnvio?: string;
  quantidade?: string;
  dataRecepcao?: string;
  entregueA?: string;
  observacoes?: string;
}
