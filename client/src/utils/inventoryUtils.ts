import { MASTER_DATA } from '../constants';

export const getHash = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (posId: string, masterData?: { positions: Record<string, { cv: string; ch: string }> }) => {
  if (masterData?.positions?.[posId]) {
    // console.log(`Found real coordinates for ${posId}:`, masterData.positions[posId]);
    return masterData.positions[posId];
  }
  
  // console.warn(`Missing real coordinates for ${posId}. Available keys: ${Object.keys(masterData?.positions || {}).length}`);
  
  return {
    cv: '?',
    ch: '?'
  };
};
