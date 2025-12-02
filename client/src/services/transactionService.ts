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

  // We don't need to calculate stock here as the backend handles it,
  // but for the UI update we might want to know the new stock.
  // However, the current requirement is to just update the transaction.
  // The Redux state will be updated with the delta.

  const txData = {
    connectorId: itemId,
    type: delta > 0 ? "IN" : "OUT",
    amount: Math.abs(delta),
    department,
  };

  // @ts-ignore - createTransaction expects Omit<Transaction, "id" | "timestamp"> but we are passing a slightly different shape if department is undefined
  // actually department is optional in Transaction type too.
  const transaction = await import("@/api/transactionsApi").then((api) =>
    api.createTransaction(txData as any)
  );

  return {
    connector: isAccessory ? null : parseConnector(itemId, masterData), // Passing empty stock map as it's not needed for parsing static data
    accessory: isAccessory
      ? parseAccessory(masterData.accessories[itemId])
      : null,
    transaction,
  };
};
