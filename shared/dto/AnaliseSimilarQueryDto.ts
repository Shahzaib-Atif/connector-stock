// Query params for finding similar analise-tab rows.
export class AnaliseSimilarQueryDto {
  encomenda!: string;
  numLinha!: number | string;
  refCliente!: string;
  estado?: string;
  cliente?: string;
  cduProjetoCliente?: string;
  newConnector?: string;
}
