import type { Sample } from "./sampleTypes";
import type { ConnectorExtended, Accessory } from "./inventoryTypes";
import { Transaction } from "@shared/types/Transaction";

export type PaginatedItems_T =
  | Sample[]
  | ConnectorExtended[]
  | Accessory[]
  | Transaction[];
