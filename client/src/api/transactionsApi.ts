import { Transaction } from "@/types";

const STORAGE_KEY_TX = "connector_transactions";

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TX);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
};
