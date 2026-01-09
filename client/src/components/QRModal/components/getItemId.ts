export function getItemIdLink(itemId: string) {
  if (!itemId) return itemId;

  const code = itemId.trim();
  const upper = code.toUpperCase();

  // Return "Pure Data" string instead of a full URL
  if (upper.length === 4) return `boxes/${itemId}`;
  else return `connectors/${itemId}`;
}
