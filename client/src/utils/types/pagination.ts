import { SamplesDto } from "@shared/dto/SamplesDto";
import type { AccessoryExtended, ConnectorExtended } from "./inventoryTypes";
import { Transaction } from "@shared/types/Transaction";

export type PaginatedItems_T =
  | SamplesDto[]
  | ConnectorExtended[]
  | AccessoryExtended[]
  | Transaction[];

export interface PaginatedData {
  paginatedItems: PaginatedItems_T;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}