import { getTransactions } from "@/api/transactionsApi";
import {
  Transaction,
  Connector,
  Accessory,
  MasterData,
  AccessoryApiResponse,
} from "../types";
import { parseConnector } from "./connectorService";
import { parseAccessory } from "./accessoryService";

export const performTransaction = async (
  itemId: string,
  delta: number,
  masterData: MasterData,
  department?: string
): Promise<{
  connector: Connector | null;
  accessory: Accessory | null;
  transaction: Transaction;
}> => {
  const isAccessory = itemId.includes("_");

  const txData: Omit<Transaction, "id" | "timestamp"> = {
    itemId,
    type: delta > 0 ? "IN" : "OUT",
    amount: Math.abs(delta),
    department,
  };

  const transaction = await import("@/api/transactionsApi").then((api) =>
    api.createTransaction(txData)
  );

  return {
    connector: isAccessory ? null : parseConnector(itemId, masterData), // Passing empty stock map as it's not needed for parsing static data
    accessory: isAccessory
      ? parseAccessory(masterData.accessories[itemId])
      : null,
    transaction,
  };
};
