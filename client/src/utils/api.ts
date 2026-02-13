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
  accessoryRelatedImages: (id: string) =>
    `${API_BASE_URL}/images/accessory-extras/${id}`,
  accessoryExtrasImage: (filename: string) =>
    `${API_BASE_URL}/images/accessory-extras/file/${filename}`,
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

const folder = {
  openFolder: `${API_BASE_URL}/folder/open`,
};

export const API = {
  ...connectors,
  ...accessories,
  ...metadata,
  ...print,
  ...auth,
  ...folder,
  transactions: `${API_BASE_URL}/transactions`,
  samples: `${API_BASE_URL}/samples`,
  notifications: `${API_BASE_URL}/notifications`,
  legacy: {
    backups: `${API_BASE_URL}/legacy/backups`,
  },
};
