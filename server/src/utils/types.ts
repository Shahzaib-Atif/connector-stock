export type CreateTransactionsDto = {
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  department?: string;
};

export type CreateSampleDto = {
  Cliente?: string;
  Projeto?: string;
  EncDivmac?: string;
  Ref_Descricao?: string;
  Ref_Fornecedor?: string;
  Amostra?: string;
  Data_do_pedido?: string;
  Data_recepcao?: string;
  Entregue_a?: string;
  N_Envio?: string;
  Quantidade?: string;
  Observacoes?: string;
  NumORC?: string;
  CreatedBy?: string;
  ActualUser?: string;
};

export type UpdateSampleDto = Partial<CreateSampleDto> & {
  LasUpdateBy?: string;
};
