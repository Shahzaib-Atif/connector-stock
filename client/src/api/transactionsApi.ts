import { Transaction } from "@/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const createTransaction = async (
  transaction: Omit<Transaction, "ID" | "updatedAt">
): Promise<Transaction> => {
  const response = await fetchWithAuth(API.transactions, {
    method: "POST",
    body: JSON.stringify(transaction),
  });

  if (!response.ok) throw new Error("Failed to create transaction");

  return response.json();
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await fetchWithAuth(API.transactions);
  if (!response.ok) throw new Error("Failed to fetch transactions");

  return response.json();
};
