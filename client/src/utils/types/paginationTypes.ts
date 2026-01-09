import type { Sample } from "./sampleTypes";
import type { Connector, Accessory } from "./inventoryTypes";
import type { Transaction } from "./transactionTypes";

export type PaginatedItems_T =
  | Sample[]
  | Connector[]
  | Accessory[]
  | Transaction[];


