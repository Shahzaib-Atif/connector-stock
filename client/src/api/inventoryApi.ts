import {
  MasterData,
  Transaction,
  ColorApiResponse,
  ViasApiResponse,
  AccessoryTypeApiResponse,
  ConnectorTypeApiResponse,
  PositionApiResponse,
  ConnectorReferenceApiResponse,
  AccessoryApiResponse,
} from "../types";
import { MASTER_DATA } from "../constants";
import { API } from "@/utils/api";

const STORAGE_KEY_STOCK = "connector_stock_data";
const STORAGE_KEY_TX = "connector_transactions";

export const fetchColors = async (): Promise<{
  colors: Record<string, string>;
  colorsPT: Record<string, string>;
}> => {
  try {
    const response = await fetch(API.cors);
    if (!response.ok) {
      throw new Error("Failed to fetch colors");
    }
    const data: ColorApiResponse[] = await response.json();

    const colors: Record<string, string> = {};
    const colorsPT: Record<string, string> = {};

    data.forEach((item) => {
      colors[item.Cor_Id] = item.Cores_UK; // UK/English name
      colorsPT[item.Cor_Id] = item.CORES; // Portuguese name
    });

    return { colors, colorsPT };
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { colors: { U: "color?" }, colorsPT: { U: "color?" } };
  }
};

export const fetchVias = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(API.vias);
    if (!response.ok) {
      throw new Error("Failed to fetch vias");
    }
    const data: ViasApiResponse[] = await response.json();

    const viasMap: Record<string, string> = {};
    data.forEach((item) => {
      viasMap[item.ContagemVias] = String(item.QtdVias);
    });

    return viasMap;
  } catch (error) {
    console.error("Error fetching vias:", error);
    return { "0": "vias?" };
  }
};

export const fetchAccessoryTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(API.accessoryTypes);
    if (!response.ok) {
      throw new Error("Failed to fetch accessory types");
    }
    const data: AccessoryTypeApiResponse[] = await response.json();

    return data.map((item) => item.TypeDescription);
  } catch (error) {
    console.error("Error fetching accessory types:", error);
    return MASTER_DATA.accessoryTypes;
  }
};

export const fetchConnectorTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(API.connectorTypes);
    if (!response.ok) {
      throw new Error("Failed to fetch connector types");
    }
    const data: ConnectorTypeApiResponse[] = await response.json();

    return data.map((item) => item.Type);
  } catch (error) {
    console.error("Error fetching connector types:", error);
    return MASTER_DATA.types;
  }
};

export const fetchPositions = async (): Promise<
  Record<string, { cv: string; ch: string }>
> => {
  try {
    const response = await fetch(API.cordCon);
    if (!response.ok) {
      throw new Error("Failed to fetch positions");
    }
    const data: PositionApiResponse[] = await response.json();

    const positions: Record<string, { cv: string; ch: string }> = {};
    data.forEach((item) => {
      if (item.CON) {
        const key = item.CON.trim();
        positions[key] = {
          cv: String(item.CV).trim(),
          ch: String(item.CH).trim(),
        };
      }
    });

    return positions;
  } catch (error) {
    console.error("Error fetching positions:", error);
    return {};
  }
};

export const fetchReferences = async (): Promise<
  Record<string, ConnectorReferenceApiResponse>
> => {
  try {
    const response = await fetch(API.referencias);
    if (!response.ok) {
      throw new Error("Failed to fetch references");
    }
    const data: ConnectorReferenceApiResponse[] = await response.json();

    const references: Record<string, ConnectorReferenceApiResponse> = {};
    data.forEach((item) => {
      if (item.CODIVMAC) {
        references[item.CODIVMAC.trim()] = item;
      }
    });

    return references;
  } catch (error) {
    console.error("Error fetching references:", error);
    return {};
  }
};

export const fetchAccessories = async (): Promise<AccessoryApiResponse[]> => {
  try {
    const response = await fetch(API.accessories);
    if (!response.ok) {
      throw new Error("Failed to fetch accessories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return [];
  }
};

export const fetchMasterData = async (): Promise<MasterData> => {
  try {
    const [
      { colors, colorsPT },
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      references,
      accessories,
    ] = await Promise.all([
      fetchColors(),
      fetchVias(),
      fetchAccessoryTypes(),
      fetchConnectorTypes(),
      fetchPositions(),
      fetchReferences(),
      fetchAccessories(),
    ]);

    return {
      colors,
      colorsPT,
      vias,
      accessoryTypes,
      types: connectorTypes,
      positions,
      references,
      clients: {}, // Deprecated
      accessories,
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};

export const getStockMap = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STOCK);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveStockMap = (stockMap: Record<string, number>) => {
  localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(stockMap));
};

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TX);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
};
