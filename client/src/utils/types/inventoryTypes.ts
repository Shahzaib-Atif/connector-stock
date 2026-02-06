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
  connectorId?: string; // Reference to parent connector
}

export interface Connector_Details {
  Family: number;
  Fabricante?: string;
  Refabricante?: string;
  OBS?: string;
  Designa__o?: string;
  ActualViaCount?: number;
}

export interface Connector {
  id?: string; // Unique ID (often same as PosId or composite)
  PosId: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  details: Connector_Details;
  ConnType?: string;
  colorName?: string;
  colorNamePT?: string;
  viasName?: string;
  cv?: string | null; // Vertical Coordinate
  ch?: string | null; // Horizontal Coordinate
  cv_ma?: string | null; // Morocco Vertical Coordinate
  ch_ma?: string | null; // Morocco Horizontal Coordinate
  accessories: Accessory[]; // Linked accessories
  clientReferences?: string[]; // Legacy mappings (RefMARCA)
}

export interface Box {
  id: string; // e.g., A255 (4 chars)
  cv: string | null;
  ch: string | null;
  cv_ma: string | null;
  ch_ma: string | null;
  connectors: Connector[]; // List of connectors known in this box
  accessories: Accessory[]; // List of accessories in this box
}
