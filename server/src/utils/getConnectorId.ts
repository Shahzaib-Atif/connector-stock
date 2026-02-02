export function getConnectorId(amostra: string): string {
  if (!amostra) return '';

  const cleanAmostra = amostra.trim();

  if (cleanAmostra.includes('+')) {
    const partBeforePlus = cleanAmostra.split('+')[0].trim();
    // Return first 6 characters as requested
    return partBeforePlus.substring(0, 6);
  }

  return cleanAmostra;
}
