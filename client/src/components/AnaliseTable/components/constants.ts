export interface AnaliseTabFilters {
  encomenda: string;
  numLinha: string;
  estado: string;
  descricao: string;
  conector: string;
  refCliente: string;
  cliente: string;
  projeto: string;
}

export const defaultFilters: AnaliseTabFilters = {
  encomenda: "",
  numLinha: "",
  estado: "",
  descricao: "",
  conector: "",
  refCliente: "",
  cliente: "",
  projeto: "",
};
