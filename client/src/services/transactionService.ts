import { Transaction, Connector, Accessory, MasterData } from '../types';
import { getStockMap, saveStockMap, getTransactions, saveTransactions } from '../api/inventoryApi';
import { parseConnector, parseAccessory } from './connectorService';

export const performTransaction = (
  itemId: string, 
  delta: number, 
  masterData: MasterData,
  department?: string
): { connector: Connector | null, accessory: Accessory | null, transaction: Transaction } => {
  const stockMap = getStockMap();
  const isAccessory = itemId.includes('_');
  
  let currentStock = 0;
  if (isAccessory) {
    currentStock = stockMap[itemId] ?? parseAccessory(itemId, stockMap, masterData).stock;
  } else {
    currentStock = stockMap[itemId] ?? parseConnector(itemId, stockMap, masterData).stock;
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
    connector: isAccessory ? null : parseConnector(itemId, stockMap, masterData),
    accessory: isAccessory ? parseAccessory(itemId, stockMap, masterData) : null,
    transaction: tx
  };
};
