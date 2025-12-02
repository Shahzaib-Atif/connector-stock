const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const API = {
  connectorImages: (id: string) => `${API_BASE_URL}/images/connector/${id}`,
  accessoryImages: (id: string) => `${API_BASE_URL}/images/accessory/${id}`,
  cors: `${API_BASE_URL}/cors`,
  vias: `${API_BASE_URL}/vias`,
  accessoryTypes: `${API_BASE_URL}/accessories/types`,
  connectorTypes: `${API_BASE_URL}/connectors/types`,
  positions: `${API_BASE_URL}/positions`,
  connectors: `${API_BASE_URL}/connectors`,
  accessories: `${API_BASE_URL}/accessories`,
  transactions: `${API_BASE_URL}/transactions`,
};
