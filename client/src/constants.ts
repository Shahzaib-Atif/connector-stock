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
