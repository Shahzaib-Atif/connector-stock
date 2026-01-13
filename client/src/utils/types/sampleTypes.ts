export interface Sample {
  ID: number;
  Cliente: string;
  Ref_Descricao: string;
  EncDivmac: string;
  Quantidade: string;
  Amostra: string;
  Projeto?: string;
  Ref_Fornecedor?: string;
  Data_do_pedido?: string;
  Data_recepcao?: string;
  Entregue_a?: string;
  N_Envio?: string;
  Observacoes?: string;
  NumORC?: string;
  CreatedBy?: string;
  LasUpdateBy?: string;
  DateOfCreation?: string;
  DateOfLastUpdate?: string;
  IsActive?: boolean;
  ActualUser?: string;
  com_fio?: boolean;
  associatedItemIds?: string[];
}
