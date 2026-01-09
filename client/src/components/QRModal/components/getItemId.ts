export function getItemIdLink(itemId: string) {
  if (!itemId) return itemId;

  const code = itemId.trim();
  const upper = code.toUpperCase();

  // Return "Pure Data" string instead of a full URL
  // This makes the physical sticker resilient to network changes
  if (upper.length === 4) return `box:${itemId}`;
  else return `connector:${itemId}`;
}
