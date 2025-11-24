import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MasterData, Transaction } from '../types';
import { fetchMasterData, getStockMap, getTransactions } from '../services/inventoryService';

interface StockState {
  masterData: MasterData | null;
  loading: boolean;
  transactions: Transaction[];
  stockCache: Record<string, number>;
}

const initialState: StockState = {
  masterData: null,
  loading: true,
  transactions: [],
  stockCache: {},
};

export const initStockData = createAsyncThunk('stock/init', async () => {
  const masterData = await fetchMasterData();
  const stockCache = getStockMap();
  const transactions = getTransactions();
  return { masterData, stockCache, transactions };
});

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    updateStock: (state, action: PayloadAction<{ connectorId: string; amount: number; transaction: Transaction }>) => {
      const { connectorId, amount, transaction } = action.payload;
      state.stockCache[connectorId] = amount;
      state.transactions.unshift(transaction);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStockData.fulfilled, (state, action) => {
      state.masterData = action.payload.masterData;
      state.stockCache = action.payload.stockCache;
      state.transactions = action.payload.transactions;
      state.loading = false;
    });
  },
});

export const { updateStock } = stockSlice.actions;
export default stockSlice.reducer;
