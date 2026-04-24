import { AccessoryMap, AccessoryType } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { AccessoryDto } from "@shared/dto/AccessoryDto";
import { parseAccessory } from "@/services/accessoryService";

export const fetchAccessories = async (): Promise<AccessoryMap> => {
  const response = await fetchWithAuth(API.accessories);
  if (!response.ok) {
    throw new Error("Failed to fetch accessories");
  }

  const data: AccessoryDto[] = await response.json();
  return data.reduce<AccessoryMap>((acc, item) => {
    acc[item.Id] = parseAccessory(item);
    return acc;
  }, {});
};

export const fetchAccessoryTypes = async (): Promise<string[]> => {
  const response = await fetchWithAuth(API.accessoryTypes);
  if (!response.ok) {
    throw new Error("Failed to fetch accessory types");
  }
  const data: AccessoryType[] = await response.json();

  return data.map((item) => item.TypeDescription);
};
