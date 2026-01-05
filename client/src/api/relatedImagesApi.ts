import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const fetchRelatedImages = async (connectorId: string): Promise<string[]> => {
  const response = await fetchWithAuth(API.connectorRelatedImages(connectorId));
  if (!response.ok) {
    throw new Error("Failed to fetch related images");
  }
  return response.json();
};
