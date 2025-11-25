export const getHash = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCoordinates = (
  posId: string,
  masterData?: { positions: Record<string, { cv: string; ch: string }> }
) => {
  if (masterData?.positions?.[posId]) {
    return masterData.positions[posId];
  }

  return null;
};
