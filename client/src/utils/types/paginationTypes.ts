import type { Sample } from "./sampleTypes";
import type { Connector, Accessory } from "./inventoryTypes";
import { Transaction } from "@shared/types/Transaction";

export type PaginatedItems_T =
  | Sample[]
  | Connector[]
  | Accessory[]
  | Transaction[];
