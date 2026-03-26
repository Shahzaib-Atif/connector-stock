export type AnaliseTabDto = {
  Encomenda: string;
  NumLinha: number;
  Estado: string;
  Quantidade?: number | null;
  Artigo?: string | null;
  Descricao?: string | null;
  Conector: string;
  RefCliente: string;
  Cliente?: string | null;
  Sector?: string | null;
  DataAbertura?: Date | null;
  DataEntrega?: Date | null;
  CDU_ProjetoCliente?: string | null;
};
