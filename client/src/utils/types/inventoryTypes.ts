import { ConnectorDto } from "@shared/dto/ConnectorDto";
import { AccessoryDto } from "@shared/dto/AccessoryDto";
import { BoxDto } from "@shared/dto/BoxDto";

// has extra properties
export type ConnectorExtended = ConnectorDto & {
  colorName?: string;
  colorNamePT?: string;
  viasName?: string;
  position?: BoxDto | null;
  accessories: AccessoryDto[]; // Linked accessories
};

// has extra properties
export type AccessoryExtended = AccessoryDto & {
  posId: string | null; // e.g. A255
};

export type BoxExtended = BoxDto & {
  connectors: ConnectorExtended[]; // connectors in this box
  accessories: AccessoryDto[]; // accessories in this box
};

export type ConnectorMap = Record<string, ConnectorExtended>;
export type AccessoryMap = Record<number, AccessoryExtended>;
export type ConnPositionsMap = Record<string, BoxDto>;
