export function getObservation(Observacoes: string, com_fio: boolean) {
  let obs = com_fio ? "c/fio" : "s/fio";
  if (Observacoes && Observacoes.trim() !== "") obs += ` - ${Observacoes}`;

  return obs;
}

export const btnClass1 =
  "p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors";

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
    // Return first 6 characters as requested
    return partBeforePlus.substring(0, 6);
  }

  return cleanAmostra;
}
