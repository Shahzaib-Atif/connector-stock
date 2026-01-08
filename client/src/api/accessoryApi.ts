import { constructAccessoryId } from "@/services/accessoryService";
import {
  AccessoryApiResponse,
  AccessoryType,
  MasterData,
} from "@/utils/types/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const fetchAccessories = async (): Promise<
  MasterData["accessories"]
> => {
  const response = await fetchWithAuth(API.accessories);
  if (!response.ok) {
    throw new Error("Failed to fetch accessories");
  }

  const data: AccessoryApiResponse[] = await response.json();

  const accessories = {};
  data.forEach((item) => {
    if (item.RefClient) {
      const id = constructAccessoryId(item);
      accessories[id] = item;
    }
  });

  return accessories;
};

export const fetchAccessoryTypes = async (): Promise<string[]> => {
  const response = await fetchWithAuth(API.accessoryTypes);
  if (!response.ok) {
    throw new Error("Failed to fetch accessory types");
  }
  const data: AccessoryType[] = await response.json();

  return data.map((item) => item.TypeDescription);
};
