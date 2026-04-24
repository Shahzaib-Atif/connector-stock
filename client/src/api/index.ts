import { fetchConnectorTypes, fetchConnectors } from "./connectorApi";
import { fetchAccessoryTypes, fetchAccessories } from "./accessoryApi";
import {
  fetchColors,
  fetchVias,
  fetchPositions,
  fetchFabricantes,
} from "./metadataApi";
import { ConnectorMap, MasterData } from "@/utils/types";
import { mapToConnectorExtended } from "@/utils/functions/connector";

export const fetchMasterData = async (): Promise<MasterData> => {
  try {
    const [
      colors,
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      accessories,
      connectors,
      fabricantes,
    ] = await Promise.all([
      fetchColors(),
      fetchVias(),
      fetchAccessoryTypes(),
      fetchConnectorTypes(),
      fetchPositions(),
      fetchAccessories(),
      fetchConnectors(),
      fetchFabricantes(),
    ]);

    // parse each connector (ConnectorDto -> ConnectorExtended)
    const connectorsMapped = connectors.reduce<ConnectorMap>((acc, item) => {
      if (item) {
        const id = item.CODIVMAC?.trim();
        acc[id] = mapToConnectorExtended(
          id,
          item,
          positions,
          accessories,
          colors,
          vias,
        );
      }
      return acc;
    }, {});

    return {
      colors,
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      connectors: connectorsMapped,
      accessories,
      fabricantes,
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};
