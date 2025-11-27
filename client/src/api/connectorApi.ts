import {
  ConnectorReferenceApiResponse,
  ConnectorTypeApiResponse,
} from "@/types";
import { API } from "@/utils/api";

export const fetchReferencias = async (): Promise<
  Record<string, ConnectorReferenceApiResponse>
> => {
  try {
    const response = await fetch(API.referencias);
    if (!response.ok) {
      throw new Error("Failed to fetch references");
    }
    const data: ConnectorReferenceApiResponse[] = await response.json();

    const references: Record<string, ConnectorReferenceApiResponse> = {};
    data.forEach((item) => {
      if (item.CODIVMAC) {
        references[item.CODIVMAC.trim()] = item;
      }
    });

    return references;
  } catch (error) {
    console.error("Error fetching references:", error);
    return {};
  }
};

export const fetchConnectorTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(API.connectorTypes);
    if (!response.ok) {
      throw new Error("Failed to fetch connector types");
    }
    const data: ConnectorTypeApiResponse[] = await response.json();

    return data.map((item) => item.Type);
  } catch (error) {
    console.error("Error fetching connector types:", error);
    return [];
  }
};
