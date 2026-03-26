import { Transaction } from '@shared/types/Transaction';

export interface ParsedMessage {
  conector?: string;
  encomenda?: string;
  prodId?: string;
  wireType?: string;
  sample?: string;
}

export type CreateTransactionsDto = Omit<Transaction, 'ID'>;
