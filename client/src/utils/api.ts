const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const connectors = {
  connectorTypes: `${API_BASE_URL}/connectors/types`,
  connectors: `${API_BASE_URL}/connectors`,
  connectorImages: (id: string) => `${API_BASE_URL}/images/connector/${id}`,
  connectorRelatedImages: (id: string) => `${API_BASE_URL}/images/extras/${id}`,
  extrasImage: (filename: string) => `${API_BASE_URL}/images/extras/file/${filename}`,
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
  fabricantes: `${API_BASE_URL}/fabricantes`,
};

const print = {
  printLabel: `${API_BASE_URL}/print/label`,
};

const auth = {
  login: `${API_BASE_URL}/auth/login`,
  users: `${API_BASE_URL}/auth/users`,
  changePwd: `${API_BASE_URL}/auth/change-password`,
};

export const API = {
  ...connectors,
  ...accessories,
  ...metadata,
  ...print,
  ...auth,
  transactions: `${API_BASE_URL}/transactions`,
  samples: `${API_BASE_URL}/samples`,
};
