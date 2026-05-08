import { LegacyBackup } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";

export const fetchLegacyBackups = async (): Promise<LegacyBackup[]> => {
  const response = await fetchWithAuth(API.legacy.backups);
  if (!response.ok) {
    throw new Error("Failed to fetch legacy backups");
  }
  return await response.json();
};

export const updateLegacyConnectorType = async (
  connectorId: string,
  connType: string,
  lastChangeBy?: string | null,
) => {
  const response = await fetchWithAuth(
    API.legacy.updateConnectorType(connectorId),
    {
      method: "POST",
      body: JSON.stringify({
        connType,
        lastChangeBy,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update!");
  }

  return response.json();
};
