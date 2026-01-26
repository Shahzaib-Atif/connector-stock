import { LegacyBackup } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const fetchLegacyBackups = async (): Promise<LegacyBackup[]> => {
  const response = await fetchWithAuth(API.legacy.backups);
  if (!response.ok) {
    throw new Error("Failed to fetch legacy backups");
  }
  return await response.json();
};
