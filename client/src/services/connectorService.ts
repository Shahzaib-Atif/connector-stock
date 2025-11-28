import { getStockMap } from "@/api/stockApi";
import {
  Connector,
  Box,
  Accessory,
  MasterData,
  AccessoryApiResponse,
} from "../types";
import { getCoordinates } from "../utils/inventoryUtils";

// Construct a unique ID using ConnName, RefClient, and RefDV
export function constructAccessoryId(apiAccessory: any) {
  const connName = apiAccessory.ConnName || "";
  const refClient = apiAccessory.RefClient || "";
  const refDV = apiAccessory.RefDV || "";

  if (refDV) return `${connName}_${refClient}_${refDV}`;
  else return `${connName}_${refClient}`;
}

export const parseAccessory = (
  apiAccessory: AccessoryApiResponse,
  stockMap: Record<string, number>,
  masterData: MasterData
): Accessory => {
  const connectorId = apiAccessory.ConnName || "";
  const id = constructAccessoryId(apiAccessory);
  const posId = connectorId.substring(0, 4);

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = 0;
  }

  return {
    id,
    connectorId,
    posId,
    stock,
    type: apiAccessory.AccessoryType,
    refClient: apiAccessory.RefClient,
    refDV: apiAccessory.RefDV,
    capotAngle: apiAccessory.CapotAngle || undefined,
    clipColor: apiAccessory.ClipColor || undefined,
  };
};

export const parseConnector = (
  id: string,
  stockMap: Record<string, number>,
  masterData: MasterData
): Connector | null => {
  const reference = masterData.connectors?.[id];

  if (!reference) {
    return null;
  }

  const posId = reference.Pos_ID;
  const colorCode = reference.Cor;
  const viasCode = reference.Vias;
  const type = reference.ConnType;
  const fabricante = reference.Fabricante || "--";
  const refabricante = reference.Refabricante || "";

  const coords = getCoordinates(posId, masterData);

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = 0; // Default to 0 stock if not found
  }

  // Find associated accessories from the real API data
  const accessories: Accessory[] = [];
  if (masterData.accessories) {
    masterData.accessories.forEach((acc) => {
      if (acc.ConnName === id) {
        accessories.push(parseAccessory(acc, stockMap, masterData));
      }
    });
  }

  return {
    id,
    posId,
    colorCode,
    viasCode,
    colorName: masterData.colors?.colorsUK[colorCode] || "Unknown",
    colorNamePT: masterData.colors?.colorsPT?.[colorCode] || "Unknown",
    viasName: masterData.vias[viasCode] || "Standard",
    cv: coords?.cv ?? "?",
    ch: coords?.ch ?? "?",
    fabricante,
    refabricante,
    type,
    description: `${masterData.colors[colorCode] || "Generic"} / ${
      masterData.vias[viasCode] || "Std"
    }`,
    stock,
    accessories,
  };
};

export const getBoxDetails = (
  boxId: string,
  masterData: MasterData
): Box | null => {
  if (boxId.length !== 4) return null;

  const coords = getCoordinates(boxId, masterData);
  if (!coords) return null;

  const stockMap = getStockMap();

  const connectors: Connector[] = [];

  // find all connectors that belong to this box (Pos_ID matches boxId)
  if (masterData.connectors) {
    Object.values(masterData.connectors).forEach((ref) => {
      if (ref.Pos_ID === boxId) {
        const conn = parseConnector(ref.CODIVMAC, stockMap, masterData);
        if (conn) connectors.push(conn);
      }
    });
  }

  // No fallback to demo variations. If no connectors found, return empty list.

  const accessories: Accessory[] = [];
  connectors.forEach((conn) => {
    accessories.push(...conn.accessories);
  });

  return {
    id: boxId,
    cv: coords?.cv ?? "?",
    ch: coords?.ch ?? "?",
    connectors,
    accessories,
  };
};

export const searchConnectors = (
  query: string,
  masterData: MasterData
): Connector[] => {
  const results: Connector[] = [];
  const stockMap = getStockMap();
  const normalizedQuery = query.trim().toUpperCase();

  // 1. Direct Connector ID Match (using references key)
  if (masterData.connectors && masterData.connectors[normalizedQuery]) {
    const conn = parseConnector(normalizedQuery, stockMap, masterData);
    if (conn) results.push(conn);
  }

  // 2. Box ID Match: Find all connectors in matching box
  if (masterData.positions && masterData.positions[normalizedQuery]) {
    // Filter references to find connectors in this box
    if (masterData.connectors) {
      Object.values(masterData.connectors).forEach((refItem) => {
        // Skip if already found by direct ID match
        if (refItem.CODIVMAC === normalizedQuery) return;

        if (refItem.Pos_ID === normalizedQuery) {
          const conn = parseConnector(refItem.CODIVMAC, stockMap, masterData);
          if (conn) results.push(conn);
        }
      });
    }
  }

  return results;
};
