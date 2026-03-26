export interface SamplesDto {
  ID: number;
  Cliente?: string | null;
  Projeto?: string | null;
  EncDivmac?: string | null;
  Ref_Descricao?: string | null;
  Amostra?: string | null;
  Data_do_pedido?: string | null;
  Data_recepcao?: string | null;
  Entregue_a?: string | null;
  N_Envio?: string | null;
  Quantidade: string | null;
  Observacoes?: string | null;
  CreatedBy?: string | null;
  LasUpdateBy?: string | null;
  DateOfCreation: Date | null;
  DateOfLastUpdate?: string | null;
  IsActive?: boolean;
  ActualUser?: string | null;
  NumORC?: string | null;
  Ref_Fornecedor?: string | null;
  qty_com_fio?: number | null;
  qty_sem_fio?: number | null;
  associatedItemIds?: string[];
}

export type CreateSamplesDto = Omit<
  SamplesDto,
  "ID" | "IsActive" | "DateOfCreation" | "DateOfLastUpdate"
>;
