// Helper function to get unique, non-empty options from an array of values
export function getUniqueOptions(
  values: Array<string | number | null | undefined>,
): string[] {
  const normalized = values
    .filter((v) => v !== undefined && v !== null && v !== "")
    .map((v) => String(v));

  const unique = Array.from(new Set(normalized));

  return unique.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
  );
}
