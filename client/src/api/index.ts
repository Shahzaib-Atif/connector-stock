import { fetchConnectorTypes, fetchConnectors } from "./connectorApi";
import { fetchAccessoryTypes, fetchAccessories } from "./accessoryApi";
import { fetchColors, fetchVias, fetchPositions } from "./metadataApi";
import { MasterData } from "@/types";

export const fetchMasterData = async (): Promise<MasterData> => {
  try {
    const [
      colors,
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      connectors,
      accessories,
    ] = await Promise.all([
      fetchColors(),
      fetchVias(),
      fetchAccessoryTypes(),
      fetchConnectorTypes(),
      fetchPositions(),
      fetchConnectors(),
      fetchAccessories(),
    ]);

    return {
      colors,
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      connectors,
      clients: {}, // Deprecated
      accessories,
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};
