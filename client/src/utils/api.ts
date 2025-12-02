const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const API = {
  connectorImages: (id: string) => `${API_BASE_URL}/images/connector/${id}`,
  accessoryImages: (id: string) => `${API_BASE_URL}/images/accessory/${id}`,
  cors: `${API_BASE_URL}/cors`,
  vias: `${API_BASE_URL}/vias`,
  accessoryTypes: `${API_BASE_URL}/accessory-types`,
  connectorTypes: `${API_BASE_URL}/connector-types`,
  cordCon: `${API_BASE_URL}/Cord_CON`,
  referencias: `${API_BASE_URL}/referencias`,
  accessories: `${API_BASE_URL}/accessories`,
  transactions: `${API_BASE_URL}/transactions`,
};
