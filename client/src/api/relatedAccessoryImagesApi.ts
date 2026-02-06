import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const fetchRelatedAccessoryImages = async (
  accessoryId: string,
): Promise<string[]> => {
  const response = await fetchWithAuth(API.accessoryRelatedImages(accessoryId));
  if (!response.ok) {
    throw new Error("Failed to fetch related accessory images");
  }
  return response.json();
};
