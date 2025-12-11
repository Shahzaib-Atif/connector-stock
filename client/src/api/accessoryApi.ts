import { constructAccessoryId } from "@/services/accessoryService";
import {
  AccessoryApiResponse,
  AccessoryTypeApiResponse,
  MasterData,
} from "@/types";
import { API } from "@/utils/api";

export const fetchAccessories = async (): Promise<
  MasterData["accessories"]
> => {
  const response = await fetch(API.accessories);
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
  const response = await fetch(API.accessoryTypes);
  if (!response.ok) {
    throw new Error("Failed to fetch accessory types");
  }
  const data: AccessoryTypeApiResponse[] = await response.json();

  return data.map((item) => item.TypeDescription);
};
