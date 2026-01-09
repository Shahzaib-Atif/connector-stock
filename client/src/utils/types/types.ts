export interface Accessory {
  id: string; // e.g., A255PR_1024
  AccessoryType: string;
  ConnName: string;
  Qty: number;
  RefClient?: string;
  RefDV?: string;
  CapotAngle?: string;
  ClipColor?: string;
  posId?: string; // e.g. A255
}

export interface Connector {
  PosId: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  Qty: number;
  details: Connector_Details;
  ConnType?: string;
  colorName?: string;
  colorNamePT?: string;
  viasName?: string;
  cv?: string; // Vertical Coordinate
  ch?: string; // Horizontal Coordinate
  accessories: Accessory[]; // Linked accessories
  clientReferences?: string[]; // Legacy mappings (RefMARCA)
}

export interface Connector_Details {
  Family: number;
  Fabricante?: string;
  Refabricante?: string;
  OBS?: string;
  Designa__o?: string;
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
  IsActive?: boolean;
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

export type PaginatedItems_T =
  | Sample[]
  | Connector[]
  | Accessory[]
  | Transaction[];

export interface MasterData {
  colors: {
    colorsUK: Record<string, string>;
    colorsPT: Record<string, string>;
  };
  vias: Record<string, string>;
  connectorTypes: string[];
  accessoryTypes: string[];
  positions: Record<string, { cv: string; ch: string }>;
  connectors: Record<string, Connector>;
  accessories: Record<string, Accessory>;
  fabricantes: string[];
}

export interface IColor {
  Cor_Id: string;
  CORES: string;
  Cores_UK: string;
}

export interface IVias {
  QtdVias: number;
  ContagemVias: string;
}

export interface AccessoryType {
  ID: number;
  TypeDescription: string;
}

export interface ConnectorType {
  ID: number;
  Type: string;
  Section: string;
}

export interface ConnPosition {
  CON: string;
  CV: string;
  CH: string;
}
