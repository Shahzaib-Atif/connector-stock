import { ConnectorType } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { CreateConnectorDto } from "@shared/dto/ConnectorDto";
import { ConnectorDto } from "@shared/dto/ConnectorDto";
import { getErrorMsg } from "@shared/utils/getErrorMsg";

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

export const createConnector = async (
  payload: CreateConnectorDto,
): Promise<ConnectorDto> => {
  const response = await fetchWithAuth(API.connectors, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create connector");
    } catch (e: unknown) {
      throw new Error(getErrorMsg(e) || "Failed to create connector");
    }
  }

  return response.json();
};
