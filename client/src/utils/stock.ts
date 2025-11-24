// Prefers cached quantity but falls back gracefully.
export const resolveLiveStock = (
  stockCache: Record<string, number>,
  itemId: string,
  fallback: number
) => {
  const cached = stockCache[itemId];
  return typeof cached === "number" ? cached : fallback;
};

