import { MasterData, Transaction } from '../types';
import { MOCK_MASTER_DATA } from '../constants';

const STORAGE_KEY_STOCK = 'connector_stock_data';
const STORAGE_KEY_TX = 'connector_transactions';

export const fetchMasterData = async (): Promise<MasterData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MASTER_DATA), 500);
  });
};

export const getStockMap = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STOCK);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveStockMap = (stockMap: Record<string, number>) => {
  localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(stockMap));
};

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
