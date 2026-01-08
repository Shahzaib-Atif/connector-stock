import { Accessory } from "@/utils/types/types";

export const parseAccessory = (apiAccessory: Accessory): Accessory => {
  const connectorId = apiAccessory.ConnName || "";
  const id = constructAccessoryId(apiAccessory);
  const posId = connectorId.substring(0, 4);

  return {
    id,
    ConnName: connectorId,
    connectorId,
    posId,
    Qty: apiAccessory.Qty,
    AccessoryType: apiAccessory.AccessoryType,
    RefClient: apiAccessory.RefClient,
    RefDV: apiAccessory.RefDV,
    CapotAngle: apiAccessory.CapotAngle || undefined,
    ClipColor: apiAccessory.ClipColor || undefined,
  };
};

// Construct a unique ID using ConnName, RefClient, and RefDV
export function constructAccessoryId(apiAccessory: Accessory) {
  const connName = apiAccessory.ConnName || "";
  const refClient = apiAccessory.RefClient || "";
  const refDV = apiAccessory.RefDV || "";

  if (refDV) return `${connName}_${refClient}_${refDV}`;
  else return `${connName}_${refClient}`;
}
