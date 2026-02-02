export interface Transaction {
  ID: string;
  itemId: string; // accessory or connector id
  transactionType: "IN" | "OUT";
  amount: number;
  itemType: "connector" | "accessory";
  department?: string;
  updatedAt?: number;
  notes?: string;
}



