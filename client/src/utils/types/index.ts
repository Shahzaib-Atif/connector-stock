import { Accessory, Connector } from "./inventoryTypes";

// Re-exports
export * from "./inventoryTypes";
export * from "./notificationTypes";
export * from "./paginationTypes";
export * from "./sampleTypes";
export * from "./shared";
export * from "./transactionTypes";
export * from "./userTypes";

// Master Data Types (Centralized here)
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
