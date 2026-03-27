import { ConnectorType } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";
import { ConnectorDto } from "@shared/dto/ConnectorDto";

export const fetchConnectors = async (): Promise<ConnectorDto[]> => {
  const response = await fetchWithAuth(API.connectors);
  if (!response.ok) {
    throw new Error("Failed to fetch references");
  }
  const data: ConnectorDto[] = await response.json();
  return data;
};

export const fetchConnectorTypes = async (): Promise<string[]> => {
  const response = await fetchWithAuth(API.connectorTypes);
  if (!response.ok) {
    throw new Error("Failed to fetch connector types");
  }
  const data: ConnectorType[] = await response.json();

  return data.map((item) => item.Type);
};
