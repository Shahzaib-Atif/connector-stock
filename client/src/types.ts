export interface Accessory {
  id: string; // e.g., A255PR_1024
  connectorId: string; // e.g. A255PR
  posId: string; // e.g. A255
  refClient: string;
  refDV: string;
  type: string;
  stock: number;
  capotAngle?: string;
  clipColor?: string;
}

export interface Connector {
  id: string; // e.g., A255PR (6 chars)
  posId: string; // e.g., A255 (4 chars)
  colorCode: string; // e.g., P
  viasCode: string; // e.g., R
  colorName: string;
  colorNamePT: string;
  viasName: string;
  cv: string; // Vertical Coordinate
  ch: string; // Horizontal Coordinate
  fabricante: string;
  refabricante: string;
  type: string;
  description: string;
  stock: number;
  accessories: Accessory[]; // Linked accessories
}

export interface Box {
  id: string; // e.g., A255 (4 chars)
  cv: string;
  ch: string;
  connectors: Connector[]; // List of connectors known in this box
  accessories: Accessory[]; // List of accessories in this box
}

export interface Sample {
  ID: number;
  Cliente?: string;
  Projeto?: string;
  EncDivmac?: string;
  Ref_Descricao?: string;
  Ref_Fornecedor?: string;
  Amostra?: string;
  Data_do_pedido?: string;
  Data_recepcao?: string;
  Entregue_a?: string;
  N_Envio?: string;
  Quantidade?: string;
  Observacoes?: string;
  NumORC?: string;
  CreatedBy?: string;
  LasUpdateBy?: string;
  DateOfCreation?: string;
  DateOfLastUpdate?: string;
  IsActive: boolean;
  ActualUser?: string;
  com_fio?: boolean;
}

export interface Transaction {
  ID: string;
  itemId: string; // accessory or connector id
  transactionType: "IN" | "OUT";
  amount: number;
  itemType: "connector" | "accessory";
  department?: string;
  updatedAt?: number;
}

export interface MasterData {
  colors: {
    colorsUK: Record<string, string>;
    colorsPT: Record<string, string>;
  };
  vias: Record<string, string>;
  connectorTypes: string[];
  clients: Record<string, string>;
  accessoryTypes: string[];
  positions: Record<string, { cv: string; ch: string }>;
  connectors: Record<string, ConnectorReferenceApiResponse>;
  accessories: Record<string, AccessoryApiResponse>;
}

export interface ColorApiResponse {
  Cor_Id: string;
  CORES: string;
  Cores_UK: string;
}

export interface ViasApiResponse {
  QtdVias: number;
  ContagemVias: string;
}

export interface AccessoryTypeApiResponse {
  ID: number;
  TypeDescription: string;
}

export interface ConnectorTypeApiResponse {
  ID: number;
  Type: string;
  Section: string;
}

export interface PositionApiResponse {
  CON: string;
  CV: string;
  CH: string;
}

export interface ConnectorReferenceApiResponse {
  PosId: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  ConnType: string;
  Fabricante: string | null;
  Refabricante: string | null;
  Qty: number | null;
}

export interface AccessoryApiResponse {
  ConnName: string;
  AccessoryType: string;
  RefClient: string | null;
  RefDV: string | null;
  Qty: number | null;
  CapotAngle: string | null;
  ClipColor: string | null;
}

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
}
