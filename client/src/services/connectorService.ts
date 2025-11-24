import { Connector, Box, Accessory, MasterData } from "../types";
import {
  getHash,
  getCoordinates,
} from "../utils/inventoryUtils";
import { getStockMap } from "../api/inventoryApi";

export const parseAccessory = (
  id: string,
  stockMap: Record<string, number>,
  masterData: MasterData
): Accessory => {
  // ID Format: ConnectorID_ClientRef (e.g., A255PR_8432)
  const parts = id.split("_");
  const connectorId = parts[0];

  const posId = connectorId.substring(0, 4);
  
  // Handle numeric ref in ID if present
  const clientRef = parts[1] || "";
  const clientName = masterData.clients[clientRef] || "Unknown";

  const hash = getHash(id);
  const type =
    masterData.accessoryTypes[hash % masterData.accessoryTypes.length];

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = hash % 50;
  }

  return {
    id,
    connectorId,
    posId,
    clientRef,
    clientName,
    type,
    stock,
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

  // Generate associated accessories
  // Note: Accessories are still somewhat mocked as we don't have a full accessory API yet,
  // but we link them to the real client ref.
  const accessoryId = `${id}_${clientRef}`;
  const accessories = [parseAccessory(accessoryId, stockMap, masterData)];

  return {
    id,
    posId,
    colorCode,
    viasCode,
    colorName: masterData.colors[colorCode] || "Unknown",
    colorNamePT: masterData.colorsPT?.[colorCode] || "Unknown",
    viasName: masterData.vias[viasCode] || "Standard",
    cv: coords.cv,
    ch: coords.ch,
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
  const stockMap = getStockMap();

  const connectors: Connector[] = [];
  
  // If we have real references, find all connectors that belong to this box (Pos_ID matches boxId)
  if (masterData.references) {
    Object.values(masterData.references).forEach(ref => {
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
    cv: coords.cv,
    ch: coords.ch,
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

  // 2. Box ID Match (using positions key)
  // If the query matches a known Position ID (Box), find all connectors in that box.
  if (masterData.positions && masterData.positions[normalizedQuery]) {
    // We found a valid Box ID. Now we need to find connectors in this box.
    // Since we don't have a direct box->connectors map, we filter references.
    if (masterData.references) {
      Object.values(masterData.references).forEach((refItem) => {
        // Avoid duplicates if we already found it by ID (unlikely if query is 4 chars and ID is 6, but good practice)
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
