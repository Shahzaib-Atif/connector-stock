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
}

export interface Connector {
  id?: string; // Unique ID (often same as PosId or composite)
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

export interface Box {
  id: string; // e.g., A255 (4 chars)
  cv: string;
  ch: string;
  connectors: Connector[]; // List of connectors known in this box
  accessories: Accessory[]; // List of accessories in this box
}


