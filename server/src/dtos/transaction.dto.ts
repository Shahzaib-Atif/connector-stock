export type CreateTransactionsDto = {
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  subType?: string; // 'COM_FIO', 'SEM_FIO'
  encomenda?: string;
  department?: string;
  notes?: string;
};
