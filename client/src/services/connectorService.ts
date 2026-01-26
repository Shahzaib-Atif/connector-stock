import {
  Connector,
  Box,
  Accessory,
  MasterData,
  LegacyBackup,
} from "../utils/types";
import { getCoordinates } from "../utils/inventoryUtils";
import { parseAccessory } from "./accessoryService";
import { API } from "../utils/api";

export const mapLegacyToConnector = (
  legacy: LegacyBackup,
  masterData: MasterData,
): Connector => {
  const posId = legacy.Pos_ID || "----";
  const coords = getCoordinates(posId, masterData);

  return {
    CODIVMAC: legacy.CODIVMAC,
    PosId: posId,
    Cor: legacy.Cor,
    Vias: legacy.Vias || "0",
    colorName: masterData.colors?.colorsUK[legacy.Cor] || "-",
    colorNamePT: masterData.colors?.colorsPT?.[legacy.Cor] || "-",
    viasName: legacy.Vias ? masterData.vias[legacy.Vias] : "-",
    cv: coords?.cv ?? "?",
    ch: coords?.ch ?? "?",
    details: {
      Family: 1, // Default for legacy
      Fabricante: legacy.Fabricante || "--",
      Refabricante: legacy.Refabricante || "",
      OBS: legacy.OBS,
      Designa__o: legacy.Designa__o,
    },
    ConnType: legacy.ConnType,
    Qty: 0, // Default for legacy
    accessories: [],
    clientReferences: [],
  };
};

export const parseConnector = (
  id: string,
  masterData: MasterData,
): Connector | null => {
  const reference = masterData.connectors?.[id];
  if (!reference) {
    return null;
  }

  const posId = reference.PosId;
  const colorCode = reference.Cor;
  const viasCode = reference.Vias;
  const type = reference.ConnType;
  const fabricante = reference.details.Fabricante || "--";
  const refabricante = reference.details.Refabricante || "";
  const coords = getCoordinates(posId, masterData);

  // Find associated accessories
  const accessories: Accessory[] = [];
  if (masterData.accessories) {
    Object.values(masterData.accessories).forEach((acc) => {
      if (acc.ConnName === id) {
        accessories.push(parseAccessory(acc));
      }
    });
  }

  return {
    CODIVMAC: id,
    PosId: posId,
    Cor: colorCode,
    Vias: viasCode,
    colorName: masterData.colors?.colorsUK[colorCode] || "Unknown",
    colorNamePT: masterData.colors?.colorsPT?.[colorCode] || "Unknown",
    viasName: masterData.vias[viasCode] || "Standard",
    cv: coords?.cv ?? "?",
    ch: coords?.ch ?? "?",
    details: {
      Family: reference.details.Family,
      Fabricante: fabricante,
      Refabricante: refabricante,
      OBS: reference.details.OBS,
    },
    ConnType: type,
    Qty: masterData.connectors[id].Qty,
    accessories,
    clientReferences: reference.clientReferences || [],
  };
};

export const getBoxDetails = (
  boxId: string,
  masterData: MasterData,
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
  masterData: MasterData,
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

import { fetchWithAuth } from "../utils/fetchClient";

export const updateConnectorApi = async (
  connectorId: string,
  data: Partial<Connector>,
) => {
  const response = await fetchWithAuth(
    `${API.connectors}/${connectorId}/update`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update connector");
  }

  return response.json();
};
