import { MasterData, Transaction, ColorApiResponse } from "../types";
import { MOCK_MASTER_DATA } from "../constants";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const STORAGE_KEY_STOCK = "connector_stock_data";
const STORAGE_KEY_TX = "connector_transactions";

export const fetchColors = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cors`);
    if (!response.ok) {
      throw new Error("Failed to fetch colors");
    }
    const data: ColorApiResponse[] = await response.json();

    const colorMap: Record<string, string> = {};
    data.forEach((item) => {
      colorMap[item.Cor_Id] = item.Cores_UK; // Using UK/English name
    });

    return colorMap;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { U: "color?" };
  }
};

export const fetchMasterData = async (): Promise<MasterData> => {
  const colors = await fetchColors();

  return {
    ...MOCK_MASTER_DATA,
    colors,
  };
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
