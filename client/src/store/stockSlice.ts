import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../types";
import { getStockMap } from "@/api/stockApi";
import { getTransactions } from "@/api/transactionsApi";

interface StockState {
  transactions: Transaction[];
  stockCache: Record<string, number>;
}

const initialState: StockState = {
  transactions: [],
  stockCache: {},
};

// Loads stock map and transactions into initial Redux state.
export const initStockData = createAsyncThunk("stock/init", async () => {
  const stockCache = getStockMap();
  const transactions = getTransactions();
  return { stockCache, transactions };
});

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    // Updates item stock amount and prepends a new transaction.
    updateStock: (
      state,
      action: PayloadAction<{
        connectorId: string;
        amount: number;
        transaction: Transaction;
      }>
    ) => {
      const { connectorId, amount, transaction } = action.payload;
      state.stockCache[connectorId] = amount;
      state.transactions.unshift(transaction);
    },
  },
  extraReducers: (builder) => {
    // Populates state with fetched data.
    builder.addCase(initStockData.fulfilled, (state, action) => {
      state.stockCache = action.payload.stockCache;
      state.transactions = action.payload.transactions;
    });
  },
});

export const { updateStock } = stockSlice.actions;
export default stockSlice.reducer;
