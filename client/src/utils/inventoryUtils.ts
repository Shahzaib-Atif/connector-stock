import { MOCK_CLIENT_MAP, MASTER_DATA } from '../constants';

export const getHash = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (posId: string, masterData?: { positions: Record<string, { cv: string; ch: string }> }) => {
  if (masterData?.positions?.[posId]) {
    // console.log(`Found real coordinates for ${posId}:`, masterData.positions[posId]);
    return masterData.positions[posId];
  }
  
  console.warn(`Missing real coordinates for ${posId}. Available keys: ${Object.keys(masterData?.positions || {}).length}`);
  
  const hash = getHash(posId);
  console.warn(`Using mock coordinates for ${posId}`);
  return {
    cv: `V-${(hash % 90) + 10}`,
    ch: `H-${(hash % 50) + 10}`
  };
};

export const getClientRefData = (posId: string): { ref: number, name: string } => {
  const hash = getHash(posId);
  const clientIds = Object.keys(MOCK_CLIENT_MAP).map(Number);
  const ref = clientIds[hash % clientIds.length];
  return { ref, name: MOCK_CLIENT_MAP[ref] };
};

export const getType = (posId: string, masterData: { types: string[] }) => {
  if (!masterData.types || masterData.types.length === 0) {
    return "Unknown";
  }
  const hash = getHash(posId);
  return masterData.types[hash % masterData.types.length];
};
