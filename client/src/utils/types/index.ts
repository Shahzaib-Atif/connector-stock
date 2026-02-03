import { Accessory, Connector } from "./inventoryTypes";

// Re-exports
export * from "./inventoryTypes";
export * from "./notificationTypes";
export * from "./paginationTypes";
export * from "./sampleTypes";
export * from "./shared";
export * from "./transactionTypes";
export * from "./userTypes";
export * from "./legacyTypes";

// Master Data Types (Centralized here)
export interface MasterData {
  colors: {
    colorsUK: Record<string, string>;
    colorsPT: Record<string, string>;
  };
  vias: Record<string, string>;
  connectorTypes: string[];
  accessoryTypes: string[];
  positions: Record<string, { 
    cv: string | null; 
    ch: string | null; 
    cv_ma: string | null; 
    ch_ma: string | null; 
  }>;
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
  CV: string | null;
  CH: string | null;
  CV_Ma: string | null;
  CH_Ma: string | null;
}
