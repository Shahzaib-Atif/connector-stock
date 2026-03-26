export interface RegAmostrasOrcDto {
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
