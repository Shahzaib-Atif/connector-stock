import { MOCK_CLIENT_MAP, MOCK_MASTER_DATA } from '../constants';

export const getHash = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (posId: string) => {
  const hash = getHash(posId);
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
  const hash = getHash(posId);
  return masterData.types[hash % masterData.types.length];
};
