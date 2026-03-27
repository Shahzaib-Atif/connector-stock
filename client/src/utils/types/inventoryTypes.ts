import { ConnectorDto } from "@shared/dto/ConnectorDto";

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

// has extra properties
export type ConnectorExtended = ConnectorDto & {
  colorName?: string;
  colorNamePT?: string;
  viasName?: string;
  cv?: string | null;
  ch?: string | null;
  cv_ma?: string | null;
  ch_ma?: string | null;
  accessories: Accessory[]; // Linked accessories
};

export type ConnectorMap = Record<string, ConnectorExtended>;
export type AccessoryMap = Record<string, Accessory>;

export interface Box {
  id: string; // e.g., A255 (4 chars)
  cv: string | null;
  ch: string | null;
  cv_ma: string | null;
  ch_ma: string | null;
  connectors: ConnectorExtended[]; // connectors in this box
  accessories: Accessory[]; // accessories in this box
}
