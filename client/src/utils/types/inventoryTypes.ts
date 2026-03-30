import { ConnectorDto } from "@shared/dto/ConnectorDto";
import { AccessoryDto } from "@shared/dto/AccessoryDto";

// has extra properties
export type ConnectorExtended = ConnectorDto & {
  colorName?: string;
  colorNamePT?: string;
  viasName?: string;
  cv?: string | null;
  ch?: string | null;
  cv_ma?: string | null;
  ch_ma?: string | null;
  accessories: AccessoryDto[]; // Linked accessories
};

// has extra properties
export type AccessoryExtended = AccessoryDto & {
  posId: string | null; // e.g. A255
};

export type ConnectorMap = Record<string, ConnectorExtended>;
export type AccessoryMap = Record<number, AccessoryExtended>;

export interface Box {
  id: string; // e.g., A255 (4 chars)
  cv: string | null;
  ch: string | null;
  cv_ma: string | null;
  ch_ma: string | null;
  connectors: ConnectorExtended[]; // connectors in this box
  accessories: AccessoryDto[]; // accessories in this box
}
