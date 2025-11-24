import { Transaction, Connector, Accessory } from '../types';
import { getStockMap, saveStockMap, getTransactions, saveTransactions } from '../api/inventoryApi';
import { parseConnector, parseAccessory } from './connectorService';

export const performTransaction = (
  itemId: string, 
  delta: number, 
  department?: string
): { connector: Connector | null, accessory: Accessory | null, transaction: Transaction } => {
  const stockMap = getStockMap();
  const isAccessory = itemId.includes('_');
  
  let currentStock = 0;
  if (isAccessory) {
    currentStock = stockMap[itemId] ?? parseAccessory(itemId, stockMap).stock;
  } else {
    currentStock = stockMap[itemId] ?? parseConnector(itemId, stockMap).stock;
  }
  
  const newStock = Math.max(0, currentStock + delta);

  stockMap[itemId] = newStock;
  saveStockMap(stockMap);

  const tx: Transaction = {
    id: Date.now().toString(),
    connectorId: itemId, 
    type: delta > 0 ? 'IN' : 'OUT',
    amount: Math.abs(delta),
    department,
    timestamp: Date.now()
  };

  const history = getTransactions();
  history.unshift(tx);
  saveTransactions(history.slice(0, 100));

  return {
    connector: isAccessory ? null : parseConnector(itemId, stockMap),
    accessory: isAccessory ? parseAccessory(itemId, stockMap) : null,
    transaction: tx
  };
};
