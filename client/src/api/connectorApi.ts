import {
  ConnectorReferenceApiResponse,
  ConnectorTypeApiResponse,
  MasterData,
} from "@/types";
import { API } from "@/utils/api";

export const fetchConnectors = async (): Promise<MasterData["connectors"]> => {
  const response = await fetch(API.connectors);
  if (!response.ok) {
    throw new Error("Failed to fetch references");
  }
  const data: ConnectorReferenceApiResponse[] = await response.json();

  const references = {};
  data.forEach((item) => {
    if (item.CODIVMAC) {
      references[item.CODIVMAC.trim()] = item;
    }
  });

  return references;
};

export const fetchConnectorTypes = async (): Promise<string[]> => {
  const response = await fetch(API.connectorTypes);
  if (!response.ok) {
    throw new Error("Failed to fetch connector types");
  }
  const data: ConnectorTypeApiResponse[] = await response.json();

  return data.map((item) => item.Type);
};
