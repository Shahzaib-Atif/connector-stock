export type CreateTransactionsDto = {
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  department?: string;
};

export type CreateSampleDto = {
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
};

export type UpdateSampleDto = CreateSampleDto & {
  LasUpdateBy?: string;
};
