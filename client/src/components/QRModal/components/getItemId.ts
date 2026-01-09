import { ROUTES } from "@/components/AppRoutes";

export function getItemIdLink(itemId: string) {
  if (!itemId) return itemId;

  const code = itemId.trim();
  const upper = code.toUpperCase();

  // Return "Pure Data" string instead of a full URL
  if (upper.length === 4)
    return `${ROUTES.BOXES}/${itemId}`; // e.g. /BOXES/A288
  else return `${ROUTES.CONNECTORS}/${itemId}`;
}
