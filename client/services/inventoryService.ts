import { Connector, Box, MasterData, Transaction, Accessory } from '../types';
import { MOCK_ACCESSORY_TYPES } from '../constants';

const STORAGE_KEY_STOCK = 'connector_stock_data';
const STORAGE_KEY_TX = 'connector_transactions';

// --- Mock Database ---

const MOCK_CLIENT_MAP: Record<number, string> = {
  8430: 'EXT-Corp',
  8431: 'AutoSys',
  8432: 'RoboTech',
  8433: 'AeroSpaceX',
  8434: 'MarineDynamics',
  8435: 'SkyNet Systems'
};

const MOCK_MASTER_DATA: MasterData = {
  colors: {
    'P': 'Purple', 'R': 'Red', 'B': 'Blue', 'G': 'Green', 
    'Y': 'Yellow', 'W': 'White', 'K': 'Black'
  },
  vias: {
    'R': 'Round 2mm', 'S': 'Square 2mm', 'H': 'Hex 4mm', 'F': 'Flat 1mm'
  },
  types: ['High Voltage', 'Signal', 'Coaxial', 'Fiber Optic'],
  clients: MOCK_CLIENT_MAP,
  accessoryTypes: MOCK_ACCESSORY_TYPES
};

// --- Helpers ---

const getHash = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const getCoordinates = (posId: string) => {
  const hash = getHash(posId);
  return {
    cv: `V-${(hash % 90) + 10}`,
    ch: `H-${(hash % 50) + 10}`
  };
};

const getClientRefData = (posId: string): { ref: number, name: string } => {
  const hash = getHash(posId);
  const clientIds = Object.keys(MOCK_CLIENT_MAP).map(Number);
  const ref = clientIds[hash % clientIds.length];
  return { ref, name: MOCK_CLIENT_MAP[ref] };
};

const getType = (posId: string) => {
  const hash = getHash(posId);
  return MOCK_MASTER_DATA.types[hash % MOCK_MASTER_DATA.types.length];
};

// --- API Simulations ---

export const fetchMasterData = async (): Promise<MasterData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MASTER_DATA), 500);
  });
};

export const getStockMap = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STOCK);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TX);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// --- Parsing Logic ---

export const parseAccessory = (id: string, stockMap: Record<string, number>): Accessory => {
  // ID Format: ConnectorID_ClientRef (e.g., A255PR_8432)
  const parts = id.split('_');
  const connectorId = parts[0];
  
  const posId = connectorId.substring(0, 4);
  const derivedClient = getClientRefData(posId);
  
  // Handle numeric ref in ID if present
  const clientRef = parts[1] ? parseInt(parts[1], 10) : derivedClient.ref;
  const clientName = MOCK_CLIENT_MAP[clientRef] || 'Unknown';

  const hash = getHash(id);
  const type = MOCK_MASTER_DATA.accessoryTypes[hash % MOCK_MASTER_DATA.accessoryTypes.length];

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = hash % 50; 
  }

  return {
    id,
    connectorId,
    posId,
    clientRef,
    clientName,
    type,
    stock
  };
};

export const parseConnector = (id: string, stockMap: Record<string, number>): Connector => {
  const posId = id.substring(0, 4);
  const colorCode = id.charAt(4);
  const viasCode = id.charAt(5);
  
  const coords = getCoordinates(posId);
  const clientData = getClientRefData(posId);
  
  let stock = stockMap[id];
  if (stock === undefined) {
    stock = getHash(id) % 150;
  }

  // Generate associated accessories
  const accessoryId = `${id}_${clientData.ref}`;
  const accessories = [parseAccessory(accessoryId, stockMap)];

  return {
    id,
    posId,
    colorCode,
    viasCode,
    colorName: MOCK_MASTER_DATA.colors[colorCode] || 'Unknown',
    viasName: MOCK_MASTER_DATA.vias[viasCode] || 'Standard',
    cv: coords.cv,
    ch: coords.ch,
    clientRef: clientData.ref,
    clientName: clientData.name,
    type: getType(posId),
    description: `${MOCK_MASTER_DATA.colors[colorCode] || 'Generic'} / ${MOCK_MASTER_DATA.vias[viasCode] || 'Std'}`,
    stock,
    accessories
  };
};

export const getBoxDetails = (boxId: string): Box | null => {
  if (boxId.length !== 4) return null;
  
  const coords = getCoordinates(boxId);
  const stockMap = getStockMap();
  
  const connectors: Connector[] = [];
  const demoVariations = ['PR', 'BS', 'RH', 'GF']; 
  
  demoVariations.forEach(suffix => {
    connectors.push(parseConnector(boxId + suffix, stockMap));
  });

  const accessories: Accessory[] = [];
  connectors.forEach(conn => {
    accessories.push(...conn.accessories);
  });

  return {
    id: boxId,
    cv: coords.cv,
    ch: coords.ch,
    connectors,
    accessories
  };
};

// Mock Search Functionality
export const searchByClientRef = (ref: number): Connector[] => {
  const results: Connector[] = [];
  const stockMap = getStockMap();

  // Generate deterministic mock results based on the Ref
  const seed = ref % 100; 
  const mockBoxId1 = `A${seed}0`; 
  const mockBoxId2 = `B${seed}5`;

  // Mock finding 3 connectors for this client
  results.push(parseConnector(`${mockBoxId1}PR`, stockMap));
  results.push(parseConnector(`${mockBoxId1}GF`, stockMap));
  results.push(parseConnector(`${mockBoxId2}BS`, stockMap));

  // Override their client ref to match the search (since our parse logic usually derives it from ID)
  return results.map(conn => ({
      ...conn,
      clientRef: ref,
      clientName: MOCK_CLIENT_MAP[ref] || 'Unknown'
  }));
};

export const performTransaction = (
  itemId: string, 
  delta: number, 
  department?: string
): { connector: Connector | null, accessory: Accessory | null, transaction: Transaction } => {
  const stockMap = getStockMap();
  const isAccessory = itemId.includes('_');
  
  let currentStock = 0;
  if (isAccessory) {
    currentStock = stockMap[itemId] ?? parseAccessory(itemId, stockMap).stock;
  } else {
    currentStock = stockMap[itemId] ?? parseConnector(itemId, stockMap).stock;
  }
  
  const newStock = Math.max(0, currentStock + delta);

  stockMap[itemId] = newStock;
  localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(stockMap));

  const tx: Transaction = {
    id: Date.now().toString(),
    connectorId: itemId, 
    type: delta > 0 ? 'IN' : 'OUT',
    amount: Math.abs(delta),
    department,
    timestamp: Date.now()
  };

  const history = getTransactions();
  history.unshift(tx);
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(history.slice(0, 100)));

  return {
    connector: isAccessory ? null : parseConnector(itemId, stockMap),
    accessory: isAccessory ? parseAccessory(itemId, stockMap) : null,
    transaction: tx
  };
};
