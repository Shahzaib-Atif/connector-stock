import { Connector, Box, Accessory, MasterData } from "../types";
import { MOCK_CLIENT_MAP } from "../constants";
import {
  getHash,
  getCoordinates,
  getClientRefData,
  getType,
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
  const derivedClient = getClientRefData(posId);

  // Handle numeric ref in ID if present
  const clientRef = parts[1] ? parseInt(parts[1], 10) : derivedClient.ref;
  const clientName = MOCK_CLIENT_MAP[clientRef] || "Unknown";

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
  const posId = id.substring(0, 4);
  const colorCode = id.charAt(4);
  const viasCode = id.charAt(5);

  const coords = getCoordinates(posId);
  const clientData = getClientRefData(posId);

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = getHash(id) % 150;
  }

  // Generate associated accessories
  const accessoryId = `${id}_${clientData.ref}`;
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
    clientRef: clientData.ref,
    clientName: clientData.name,
    type: getType(posId, masterData),
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

  const coords = getCoordinates(boxId);
  const stockMap = getStockMap();

  const connectors: Connector[] = [];
  const demoVariations = ["PR", "BS", "RH", "GF"];

  demoVariations.forEach((suffix) => {
    connectors.push(parseConnector(boxId + suffix, stockMap, masterData));
  });

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
  ref: number,
  masterData: MasterData
): Connector[] => {
  const results: Connector[] = [];
  const stockMap = getStockMap();

  // Generate deterministic mock results based on the Ref
  const seed = ref % 100;
  const mockBoxId1 = `A${seed}0`;
  const mockBoxId2 = `B${seed}5`;

  // Mock finding 3 connectors for this client
  results.push(parseConnector(`${mockBoxId1}PR`, stockMap, masterData));
  results.push(parseConnector(`${mockBoxId1}GF`, stockMap, masterData));
  results.push(parseConnector(`${mockBoxId2}BS`, stockMap, masterData));

  // Override their client ref to match the search (since our parse logic usually derives it from ID)
  return results.map((conn) => ({
    ...conn,
    clientRef: ref,
    clientName: MOCK_CLIENT_MAP[ref] || "Unknown",
  }));
};
