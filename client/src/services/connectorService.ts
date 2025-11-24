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
): Connector => {
  const reference = masterData.references?.[id];
  
  // If reference is not found, we can't reliably determine details without mock logic.
  // We will return a basic object with "Unknown" values where data is missing.
  
  const posId = reference?.Pos_ID || id.substring(0, 4);
  const colorCode = reference?.Cor || id.charAt(4);
  const viasCode = reference?.Vias || id.charAt(5);
  const type = reference?.ConnType || "Unknown";
  const clientName = reference?.Fabricante || "Unknown";
  const clientRef = reference?.Refabricante || "";

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
        connectors.push(parseConnector(ref.CODIVMAC, stockMap, masterData));
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

export const searchByClientRef = (
  ref: string,
  masterData: MasterData
): Connector[] => {
  const results: Connector[] = [];
  const stockMap = getStockMap();

  // Search in real references first
  if (masterData.references) {
    Object.values(masterData.references).forEach(refItem => {
      // Check if Refabricante matches the search ref
      if (refItem.Refabricante && refItem.Refabricante === ref) {
        results.push(parseConnector(refItem.CODIVMAC, stockMap, masterData));
      }
    });
  }

  // No fallback to mock results.

  return results;
};
