const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const connectors = {
  connectorTypes: `${API_BASE_URL}/connectors/types`,
  connectors: `${API_BASE_URL}/connectors`,
  connectorImages: (id: string) => `${API_BASE_URL}/images/connector/${id}`,
};

const accessories = {
  accessoryImages: (id: string) => `${API_BASE_URL}/images/accessory/${id}`,
  accessoryTypes: `${API_BASE_URL}/accessories/types`,
  accessories: `${API_BASE_URL}/accessories`,
};

const metadata = {
  cors: `${API_BASE_URL}/cors`,
  vias: `${API_BASE_URL}/vias`,
  positions: `${API_BASE_URL}/positions`,
};

const print = {
  printLabel: `${API_BASE_URL}/print/label`,
};

export const API = {
  ...connectors,
  ...accessories,
  ...metadata,
  ...print,
  transactions: `${API_BASE_URL}/transactions`,
  samples: `${API_BASE_URL}/samples`,
};

