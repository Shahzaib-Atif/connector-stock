/**
 * Extracts the connector ID from an amostra string.
 * If the string contains '+', it takes the part before the '+' and returns the first 6 characters.
 * Otherwise, it returns the trimmed string.
 */
export function getConnectorId(amostra: string | undefined): string {
  if (!amostra) return "";

  const cleanAmostra = amostra.trim();

  if (cleanAmostra.includes("+")) {
    const partBeforePlus = cleanAmostra.split("+")[0].trim();
    // Return first 6 characters (or 8 in case there is a version suffix like W382P3-1)
    return partBeforePlus.substring(0, 8);
  }

  return cleanAmostra;
}
