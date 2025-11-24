import { Department } from './types';

export const DEPARTMENTS = [
  Department.ASSEMBLY,
  Department.QUALITY,
  Department.R_AND_D,
  Department.SHIPPING,
  Department.MAINTENANCE
];

export const MOCK_ACCESSORY_TYPES = [
  'Dust Cap Kit',
  'Mounting Bracket',
  'Sealing Ring',
  'Guide Pin Set',
  'Locking Latch',
  'Terminal Guard'
];

// Helper to deterministically generate "static" data from the ID string
export const getStaticAttributes = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const cv = `V-${(hash % 90) + 10}`; 
  const ch = `H-${(hash % 50) + 10}`; 
  
  // Ref Client (Numeric Mock)
  const clientRef = 8430 + (hash % 6); 

  const types = ['High Voltage', 'Signal', 'Coaxial', 'Fiber Optic'];
  const type = types[hash % types.length];

  return { cv, ch, clientRef, type };
};

export const MOCK_CLIENT_MAP: Record<number, string> = {
  8430: 'EXT-Corp',
  8431: 'AutoSys',
  8432: 'RoboTech',
  8433: 'AeroSpaceX',
  8434: 'MarineDynamics',
  8435: 'SkyNet Systems'
};

export const MOCK_MASTER_DATA = {
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
