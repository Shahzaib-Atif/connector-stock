export enum Department {
  Comercial = "Comercial",
  GT = "GT",
  ID = "ID",
  MTS = "MTS",
  Maquinacao = "Maquinacao",
  Montagem = "Montagem",
  Planamento = "Planamento",
  RH = "RH",
}

export type suggestion = {
  id: string;
  type?: "box" | "connector" | "accessory";
};

export interface PaginatedData<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

export interface QRData {
  id: string;
  source?: "box" | "connector" | "sample";
  refCliente?: string;
  encomenda?: string;
  qty?: number;
}
