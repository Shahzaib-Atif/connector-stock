import {
  ConnectorExtended,
  Box,
  Accessory,
  MasterData,
  LegacyBackup,
  AccessoryMap,
  ConnPositionsMap,
} from "../utils/types";
import { getCoordinates } from "../utils/inventoryUtils";
import { parseAccessory } from "./accessoryService";
import { API } from "../utils/api";
import { fetchWithAuth } from "../utils/fetchClient";
import { ConnectorDto } from "@shared/dto/ConnectorDto";

export const mapLegacyToConnector = (
  legacy: LegacyBackup,
  masterData: MasterData,
): ConnectorExtended => {
  const posId = legacy.Pos_ID || "----";
  const coords = getCoordinates(posId, masterData.positions);

  return {
    CODIVMAC: legacy.CODIVMAC,
    PosId: posId,
    Cor: legacy.Cor,
    Vias: legacy.Vias || "0",
    colorName: masterData.colors?.colorsUK[legacy.Cor] || "-",
    colorNamePT: masterData.colors?.colorsPT?.[legacy.Cor] || "-",
    viasName: legacy.Vias ? masterData.vias[legacy.Vias] : "-",
    cv: coords?.CV ?? null,
    ch: coords?.CH ?? null,
    cv_ma: coords?.CV_Ma ?? null,
    ch_ma: coords?.CH_Ma ?? null,
    details: {
      Family: 1, // Default for legacy
      Fabricante: legacy.Fabricante || "--",
      Refabricante: legacy.Refabricante || "",
      OBS: legacy.OBS ?? "",
      Designacao: legacy.Designa__o ?? "",
    },
    ConnType: legacy.ConnType ?? "",
    Qty: 0, // Default for legacy
    Qty_com_fio: 0, // Default for legacy
    Qty_sem_fio: 0, // Default for legacy
    accessories: [],
    clientReferences: [],
  };
};

export const parseConnector = (
  id: string,
  masterData: MasterData,
): ConnectorExtended | null => {
  if (!id) return null;

  // get connector reference
  const reference = masterData?.connectors?.[id];
  if (!reference || !masterData) return null;

  const { PosId, Cor, Vias } = reference;
  const coords = getCoordinates(PosId, masterData.positions);

  // Find associated accessories
  const accessories: Accessory[] = [];
  if (masterData.accessories) {
    Object.values(masterData.accessories).forEach((acc) => {
      if (id.includes(acc.ConnName)) {
        accessories.push(parseAccessory(acc));
      }
    });
  }

  return {
    ...reference,
    CODIVMAC: id,
    colorName: masterData.colors?.colorsUK[Cor] || "Unknown",
    colorNamePT: masterData.colors?.colorsPT?.[Cor] || "Unknown",
    viasName: masterData.vias[Vias] || "Standard",
    cv: coords?.CV ?? null,
    ch: coords?.CH ?? null,
    cv_ma: coords?.CV_Ma ?? null,
    ch_ma: coords?.CH_Ma ?? null,
    accessories: accessories ?? [],
  };
};

// map ConnectorDto -> ConnectorExtended
export const mapToConnectorExtended = (
  id: string,
  dto: ConnectorDto,
  positions: ConnPositionsMap,
  accessories: AccessoryMap,
  colors: {
    colorsUK: Record<string, string>;
    colorsPT: Record<string, string>;
  },
  vias: Record<string, string>,
): ConnectorExtended => {
  const { PosId, Cor, Vias } = dto;
  const coords = getCoordinates(PosId, positions);

  // Find associated accessories
  const _accessories: Accessory[] = [];
  if (accessories) {
    Object.values(accessories).forEach((acc) => {
      if (id.includes(acc.ConnName)) {
        _accessories.push(parseAccessory(acc));
      }
    });
  }

  return {
    ...dto,
    CODIVMAC: id,
    colorName: colors?.colorsUK[Cor] || "Unknown",
    colorNamePT: colors?.colorsPT?.[Cor] || "Unknown",
    viasName: vias[Vias] || "Standard",
    cv: coords?.CV ?? null,
    ch: coords?.CH ?? null,
    cv_ma: coords?.CV_Ma ?? null,
    ch_ma: coords?.CH_Ma ?? null,
    accessories: _accessories ?? [],
  };
};

export const getBoxDetails = (
  boxId: string,
  masterData: MasterData,
): Box | null => {
  if (!masterData || boxId.length !== 4) return null;

  const coords = getCoordinates(boxId, masterData.positions);
  if (!coords) return null;

  const connectors: ConnectorExtended[] = [];

  // find all connectors that belong to this box (Pos_ID matches boxId)
  if (masterData.connectors) {
    Object.values(masterData.connectors).forEach((ref) => {
      if (ref.PosId === boxId) {
        const conn = parseConnector(ref.CODIVMAC, masterData);
        if (conn) connectors.push(conn);
      }
    });
  }

  // Aggregate unique accessories from all connectors in the box
  const accessoryMap = new Map<string, Accessory>();
  connectors.forEach((conn) => {
    conn.accessories.forEach((acc) => {
      accessoryMap.set(acc.id, acc);
    });
  });
  const accessories = Array.from(accessoryMap.values());

  return {
    id: boxId,
    cv: coords?.CV ?? null,
    ch: coords?.CH ?? null,
    cv_ma: coords?.CV_Ma ?? null,
    ch_ma: coords?.CH_Ma ?? null,
    connectors,
    accessories,
  };
};

export const searchConnectors = (
  query: string,
  masterData: MasterData,
): ConnectorExtended[] => {
  const results: ConnectorExtended[] = [];
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

export const updateConnectorApi = async (
  connectorId: string,
  data: Partial<ConnectorExtended>,
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

export function getViasValue(connector: ConnectorExtended): string {
  const vias = connector.Vias;
  const viasName = connector.viasName;

  // If numeric (1–9), return as-is
  if (!isNaN(Number(vias))) {
    return vias;
  }

  if (connector.details?.ActualViaCount) {
    return `${vias} (${connector.details.ActualViaCount})`;
  }
  if (viasName) {
    return `${vias} (${viasName})`;
  }
  return vias;
}
