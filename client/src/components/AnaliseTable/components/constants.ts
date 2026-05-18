export interface AnaliseTabFilters {
  encomenda: string;
  estado: string;
  conector: string;
  refCliente: string;
  cliente: string;
  projeto: string;
  artigo: string;
  sector: string;
}

export const defaultFilters: AnaliseTabFilters = {
  encomenda: "",
  estado: "",
  conector: "",
  refCliente: "",
  cliente: "",
  projeto: "",
  artigo: "",
  sector: "",
};
