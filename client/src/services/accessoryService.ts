import { Accessory, AccessoryApiResponse } from "@/types";

export const parseAccessory = (
  apiAccessory: AccessoryApiResponse,
  stockMap: Record<string, number>
): Accessory => {
  const connectorId = apiAccessory.ConnName || "";
  const id = constructAccessoryId(apiAccessory);
  const posId = connectorId.substring(0, 4);

  let stock = stockMap[id];
  if (stock === undefined) {
    stock = 0;
  }

  return {
    id,
    connectorId,
    posId,
    stock: apiAccessory.Qty,
    type: apiAccessory.AccessoryType,
    refClient: apiAccessory.RefClient,
    refDV: apiAccessory.RefDV,
    capotAngle: apiAccessory.CapotAngle || undefined,
    clipColor: apiAccessory.ClipColor || undefined,
  };
};

// Construct a unique ID using ConnName, RefClient, and RefDV
export function constructAccessoryId(apiAccessory: AccessoryApiResponse) {
  const connName = apiAccessory.ConnName || "";
  const refClient = apiAccessory.RefClient || "";
  const refDV = apiAccessory.RefDV || "";

  if (refDV) return `${connName}_${refClient}_${refDV}`;
  else return `${connName}_${refClient}`;
}
