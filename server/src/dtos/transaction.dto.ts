export type CreateTransactionsDto = {
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  subType?: WireTypes;
  encomenda?: string;
  department?: string;
  notes?: string;
};

export enum WireTypes {
  COM_FIO = 'COM_FIO',
  SEM_FIO = 'SEM_FIO',
}
