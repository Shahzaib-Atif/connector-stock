export type CreateSampleDto = {
  ID?: number;
  Cliente: string;
  EncDivmac: string;
  Ref_Descricao: string;
  Amostra: string;
  Quantidade: string;
  Projeto?: string;
  Ref_Fornecedor?: string;
  Data_do_pedido?: string;
  Data_recepcao?: string;
  Entregue_a?: string;
  N_Envio?: string;
  Observacoes?: string;
  NumORC?: string;
  CreatedBy?: string;
  ActualUser?: string;
  com_fio?: boolean;
  associatedItemIds?: string[];
};

export type UpdateSampleDto = CreateSampleDto & {
  LasUpdateBy?: string;
};

// DTOs for multi-step sample creation workflow
export type AnaliseTabDto = {
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
  DataAbertura: Date | null;
  DataEntrega: Date | null;
  CDU_ProjetoCliente: string | null;
};

export type RegAmostrasEncDto = {
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
  Data_do_pedido: Date;
  Data_recepcao: Date;
  Entregue_a: string;
  N_Envio: string;
  Quantidade: string;
  Observacoes: string;
};
