export type CreateTransactionsDto = {
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  department?: string;
};
