export interface Accessory {
  id: string; // e.g., A255PR_1024
  connectorId: string; // e.g. A255PR
  posId: string; // e.g. A255
  clientRef: string; // e.g. "1024"
  clientName: string; // e.g. AutoSys
  type: string; // e.g. "Dust Cap"
  stock: number;
  capotAngle?: string;
  clipColor?: string;
  refClient?: string;
}

export interface Connector {
  id: string; // e.g., A255PR (6 chars)
  posId: string; // e.g., A255 (4 chars) - The Box ID
  colorCode: string; // e.g., P
  viasCode: string; // e.g., R
  colorName: string;
  colorNamePT: string;
  viasName: string;
  cv: string; // Vertical Coordinate
  ch: string; // Horizontal Coordinate
  clientRef: string; // String Reference
  clientName: string; // Resolved Name
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

export interface Transaction {
  id: string;
  connectorId: string; // This now serves as generic Item ID (works for Accessory ID too)
  type: "IN" | "OUT";
  amount: number;
  department?: string;
  timestamp: number;
}

export interface MasterData {
  colors: Record<string, string>;
  colorsPT: Record<string, string>;
  vias: Record<string, string>;
  types: string[];
  clients: Record<string, string>; // ID -> Name mapping
  accessoryTypes: string[];
  positions: Record<string, { cv: string; ch: string }>;
  references: Record<string, ConnectorReferenceApiResponse>;
  accessories: AccessoryApiResponse[];
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
  Pos_ID: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  ConnType: string;
  Fabricante: string | null;
  Refabricante: string | null;
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
  ASSEMBLY = "Assembly Line",
  QUALITY = "Quality Control",
  R_AND_D = "R&D Lab",
  SHIPPING = "Shipping & Logistics",
  MAINTENANCE = "Maintenance",
}

export type AppView =
  | "HOME"
  | "BOX_DETAILS"
  | "CONNECTOR_DETAILS"
  | "ACCESSORY_DETAILS"
  | "SEARCH_RESULTS";

export interface StockInsight {
  status: "healthy" | "low" | "critical" | "overstock";
  message: string;
  actionable: string;
}

export interface StockState {
  masterData: MasterData | null;
  loading: boolean;
  transactions: Transaction[];
  stockCache: Record<string, number>;
}

export type StockAction =
  | { type: "INIT_DATA"; payload: MasterData }
  | {
      type: "UPDATE_STOCK";
      payload: {
        connectorId: string;
        amount: number;
        transaction: Transaction;
      };
    };

export type suggestion = {
  id: string;
  type: "box" | "connector" | "accessory";
};
