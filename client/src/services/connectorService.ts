import { Connector, Box, Accessory, MasterData } from "../types";
import { getHash, getCoordinates } from "../utils/inventoryUtils";
import { getStockMap } from "../api/inventoryApi";

// Construct a unique ID using ConnName, RefClient, and RefDV
export function constructAccessoryId(apiAccessory: any) {
  const connName = apiAccessory.ConnName || "";
  const refClient = apiAccessory.RefClient || "";
  const refDV = apiAccessory.RefDV || "";

  if (refDV) return `${connName}_${refClient}_${refDV}`;
  else return `${connName}_${refClient}`;
}

export const parseAccessory = (
  apiAccessory: any,
  stockMap: Record<string, number>,
  masterData: MasterData
): Accessory => {
  const connectorId = apiAccessory.ConnName || "";
  const clientRef = apiAccessory.RefClient || "";
  const id = constructAccessoryId(apiAccessory);

  const posId = connectorId.substring(0, 4);
  const clientName = masterData.clients[clientRef] || "Unknown";
  const type = apiAccessory.AccessoryType;

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = 0;
  }

  return {
    id,
    connectorId,
    posId,
    clientRef,
    clientName,
    type,
    stock,
    capotAngle: apiAccessory.CapotAngle || undefined,
    clipColor: apiAccessory.ClipColor || undefined,
    refClient: apiAccessory.RefClient || undefined,
  };
};

export const parseConnector = (
  id: string,
  stockMap: Record<string, number>,
  masterData: MasterData
): Connector | null => {
  const reference = masterData.references?.[id];

  if (!reference) {
    return null;
  }

  const posId = reference.Pos_ID;
  const colorCode = reference.Cor;
  const viasCode = reference.Vias;
  const type = reference.ConnType;
  const clientName = reference.Fabricante || "Unknown";
  const clientRef = reference.Refabricante || "";

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
    colorName: masterData.colors[colorCode] || "Unknown",
    colorNamePT: masterData.colorsPT?.[colorCode] || "Unknown",
    viasName: masterData.vias[viasCode] || "Standard",
    cv: coords?.cv ?? "?",
    ch: coords?.ch ?? "?",
    clientRef,
    clientName,
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
  if (masterData.references) {
    Object.values(masterData.references).forEach((ref) => {
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
  if (masterData.references && masterData.references[normalizedQuery]) {
    const conn = parseConnector(normalizedQuery, stockMap, masterData);
    if (conn) results.push(conn);
  }

  // 2. Box ID Match: Find all connectors in matching box
  if (masterData.positions && masterData.positions[normalizedQuery]) {
    // Filter references to find connectors in this box
    if (masterData.references) {
      Object.values(masterData.references).forEach((refItem) => {
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
