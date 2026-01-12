import { ROUTES } from "@/components/AppRoutes";
import { getConnectorId } from "@/utils/idUtils";

export function getItemIdLink(itemId: string) {
  if (!itemId) return itemId;

  const parsedId = getConnectorId(itemId);
  const upper = parsedId.toUpperCase();

  // Return "Pure Data" string instead of a full URL
  if (upper.length === 4)
    return `${ROUTES.BOXES}/${parsedId}`; // e.g. /BOXES/A288
  else return `${ROUTES.CONNECTORS}/${parsedId}`;
}
