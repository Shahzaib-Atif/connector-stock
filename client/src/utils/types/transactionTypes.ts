export interface Transaction {
  ID: string;
  itemId: string; // accessory or connector id
  transactionType: "IN" | "OUT";
  amount: number;
  itemType: "connector" | "accessory";
  subType?: string; // 'COM_FIO', 'SEM_FIO'
  department?: string;
  updatedAt?: number;
  notes?: string;
}



