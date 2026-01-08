import { fetchConnectorTypes, fetchConnectors } from "./connectorApi";
import { fetchAccessoryTypes, fetchAccessories } from "./accessoryApi";
import {
  fetchColors,
  fetchVias,
  fetchPositions,
  fetchFabricantes,
} from "./metadataApi";
import { MasterData } from "@/utils/types/types";

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
      fabricantes,
    ] = await Promise.all([
      fetchColors(),
      fetchVias(),
      fetchAccessoryTypes(),
      fetchConnectorTypes(),
      fetchPositions(),
      fetchConnectors(),
      fetchAccessories(),
      fetchFabricantes(),
    ]);

    return {
      colors,
      vias,
      accessoryTypes,
      connectorTypes,
      positions,
      connectors,
      accessories,
      fabricantes,
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};
