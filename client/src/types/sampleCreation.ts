// Types for multi-step sample creation workflow

export interface AnaliseTabRow {
  Encomenda: string;
  NumLinha: number;
  Estado: string;
  Quantidade: number | null;
  Artigo: string | null;
  Descricao: string | null;
  Conector: string;
  RefCliente: string;
  Cliente: string | null;
  Sector: string | null;
  DataAbertura: string | null;
  DataEntrega: string | null;
  CDU_ProjetoCliente: string | null;
}

export interface RegAmostrasEncRow {
  cdu_projeto: string;
  CDU_ModuloRefCliente: string;
  nome: string | null;
  CDU_ProjetoCliente: string | null;
  CDU_ModuloRefConetorDV: string | null;
  ID: number;
  Cliente: string;
  Projeto: string;
  NumORC: string;
  EncDivmac: string;
  Ref_Descricao: string;
  Ref_Fornecedor: string;
  Amostra: string;
  Data_do_pedido: string | null;
  Data_recepcao: string | null;
  Entregue_a: string;
  N_Envio: string;
  Quantidade: string;
  Observacoes: string;
}


export interface RegAmostrasOrcRow {
  orcDoc: string;
  CDU_ModuloRefCliente: string;
  CDU_ProjetoCliente: string | null;
  CDU_ModuloRefConetorDV: string;
  Nome: string;
  ID: number;
  Cliente: string;
  Projeto: string;
  NumORC: string;
  EncDivmac: string;
  Ref_Descricao: string;
  Ref_Fornecedor: string;
  Amostra: string;
  Data_do_pedido: string | null;
  Data_recepcao: string | null;
  Entregue_a: string;
  N_Envio: string;
  Quantidade: string;
  Observacoes: string;
}
