import { Transaction } from "@/types";
import { API } from "@/utils/api";

export const createTransaction = async (
  transaction: Omit<Transaction, "ID" | "timestamp">
): Promise<Transaction> => {
  const response = await fetch(API.transactions, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) throw new Error("Failed to create transaction");

  return response.json();
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(API.transactions);
  if (!response.ok) throw new Error("Failed to fetch transactions");

  return response.json();
};
