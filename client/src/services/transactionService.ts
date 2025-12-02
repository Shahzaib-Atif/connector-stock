import { createTransaction } from "@/api/transactionsApi";
import { Transaction, Connector, Accessory, MasterData } from "../types";
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
    transactionType: delta > 0 ? "IN" : "OUT",
    amount: Math.abs(delta),
    itemType: isAccessory ? "accessory" : "connector",
    department,
  };

  const transaction = await createTransaction(txData);

  return {
    connector: isAccessory ? null : parseConnector(itemId, masterData),
    accessory: isAccessory
      ? parseAccessory(masterData.accessories[itemId])
      : null,
    transaction,
  };
};
