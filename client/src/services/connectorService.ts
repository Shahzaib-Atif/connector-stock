import { Connector, Box, Accessory, MasterData } from "../types";
import { getCoordinates } from "../utils/inventoryUtils";
import { parseAccessory } from "./accessoryService";
import { API } from "../utils/api";
import { SESSION_KEY } from "../utils/constants";

export const parseConnector = (
  id: string,
  masterData: MasterData
): Connector | null => {
  const reference = masterData.connectors?.[id];

  if (!reference) {
    return null;
  }

  const posId = reference.PosId;
  const colorCode = reference.Cor;
  const viasCode = reference.Vias;
  const type = reference.ConnType;
  const fabricante = reference.Fabricante || "--";
  const refabricante = reference.Refabricante || "";
  const coords = getCoordinates(posId, masterData);

  // Find associated accessories from the real API data
  const accessories: Accessory[] = [];
  if (masterData.accessories) {
    Object.values(masterData.accessories).forEach((acc) => {
      if (acc.ConnName === id) {
        accessories.push(parseAccessory(acc));
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
    stock: masterData.connectors[id].Qty,
    family: reference.Family,
    accessories,
    clientReferences: reference.ClientReferences || [],
  };
};

export const getBoxDetails = (
  boxId: string,
  masterData: MasterData
): Box | null => {
  if (boxId.length !== 4) return null;

  const coords = getCoordinates(boxId, masterData);
  if (!coords) return null;

  const connectors: Connector[] = [];

  // find all connectors that belong to this box (Pos_ID matches boxId)
  if (masterData.connectors) {
    Object.values(masterData.connectors).forEach((ref) => {
      if (ref.PosId === boxId) {
        const conn = parseConnector(ref.CODIVMAC, masterData);
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
  const normalizedQuery = query.trim().toUpperCase();

  // 1. Direct Connector ID Match (using references key)
  if (masterData.connectors && masterData.connectors[normalizedQuery]) {
    const conn = parseConnector(normalizedQuery, masterData);
    if (conn) results.push(conn);
  }

  // 2. Box ID Match: Find all connectors in matching box
  if (masterData.positions && masterData.positions[normalizedQuery]) {
    // Filter references to find connectors in this box
    if (masterData.connectors) {
      Object.values(masterData.connectors).forEach((refItem) => {
        // Skip if already found by direct ID match
        if (refItem.CODIVMAC === normalizedQuery) return;

        if (refItem.PosId === normalizedQuery) {
          const conn = parseConnector(refItem.CODIVMAC, masterData);
          if (conn) results.push(conn);
        }
      });
    }
  }


  return results;
};

export const updateConnectorApi = async (connectorId: string, data: any) => {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) throw new Error("No session found");
  const { token } = JSON.parse(session);

  const response = await fetch(`${API.connectors}/${connectorId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update connector");
  }

  return response.json();
};
