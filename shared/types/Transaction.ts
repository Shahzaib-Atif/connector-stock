import { WireTypes } from "../enums/WireTypes";

export interface Transaction {
  ID: string;
  itemId: string; // accessory or connector id
  transactionType: "IN" | "OUT";
  amount: number;
  itemType: "connector" | "accessory";
  subType?: WireTypes;
  sender?: string;
  encomenda?: string;
  department?: string;
  updatedAt?: number;
  notes?: string;
}

export type CreateTransactionsDto = Omit<Transaction, "ID">;
