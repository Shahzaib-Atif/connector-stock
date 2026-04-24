import { Department } from "./shared";

export interface TransactionConfirmPayload {
  amount: number;
  isConnector: boolean;
  associatedItemIds: number[];
  department?: Department;
  subType?: string;
  encomenda?: string;
}

export interface TransactionOpenOptions {
  transactionType: "IN" | "OUT";
  itemType: "connector" | "accessory";
  targetId?: string | number;
}
