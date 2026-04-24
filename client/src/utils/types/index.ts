import { AccessoryMap, ConnectorMap } from "./inventoryTypes";

// Re-exports
export * from "./inventoryTypes";
export * from "./notificationTypes";
export * from "./pagination";
export * from "./shared";
export * from "./legacyBackup";

// Master Data Types (Centralized here)
export interface MasterData {
  colors: {
    colorsUK: Record<string, string>;
    colorsPT: Record<string, string>;
  };
  vias: Record<string, string>;
  connectorTypes: string[];
  accessoryTypes: string[];
  positions: ConnPositionsMap;
  connectors: ConnectorMap;
  accessories: AccessoryMap;
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
  CV?: string;
  CH?: string;
  CV_Ma?: string;
  CH_Ma?: string;
}

export type ConnPositionsMap = Record<string, ConnPosition>;
