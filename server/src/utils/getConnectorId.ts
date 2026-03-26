export function getConnectorId(amostra?: string | null): string {
  if (!amostra) return '';

  const cleanAmostra = amostra.trim();

  if (cleanAmostra.includes('+')) {
    const partBeforePlus = cleanAmostra.split('+')[0].trim();
    // Return first 6 characters (or 8 in case there is a version suffix like W382P3-1)
    return partBeforePlus.substring(0, 8);
  }

  return cleanAmostra;
}
