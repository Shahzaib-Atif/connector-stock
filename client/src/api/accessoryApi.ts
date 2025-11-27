import { AccessoryApiResponse, AccessoryTypeApiResponse } from "@/types";
import { API } from "@/utils/api";

export const fetchAccessories = async (): Promise<AccessoryApiResponse[]> => {
  try {
    const response = await fetch(API.accessories);
    if (!response.ok) {
      throw new Error("Failed to fetch accessories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return [];
  }
};

export const fetchAccessoryTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(API.accessoryTypes);
    if (!response.ok) {
      throw new Error("Failed to fetch accessory types");
    }
    const data: AccessoryTypeApiResponse[] = await response.json();

    return data.map((item) => item.TypeDescription);
  } catch (error) {
    console.error("Error fetching accessory types:", error);
    return [];
  }
};
