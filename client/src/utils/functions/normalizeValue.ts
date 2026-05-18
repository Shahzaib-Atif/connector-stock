export function normalizeValue(
  value: string | number | null | undefined,
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}
