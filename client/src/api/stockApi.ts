const STORAGE_KEY_STOCK = "connector_stock_data";

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
