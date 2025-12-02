import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../types";
import { getTransactions } from "@/api/transactionsApi";

interface StockState {
  transactions: Transaction[];
}

const initialState: StockState = {
  transactions: [],
};

// Loads stock map and transactions into initial Redux state.
export const initStockData = createAsyncThunk("stock/init", async () => {
  const transactions = await getTransactions();
  return { transactions };
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
      const { transaction } = action.payload;
      state.transactions.unshift(transaction);
    },
  },
  extraReducers: (builder) => {
    // Populates state with fetched data.
    builder.addCase(initStockData.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions;
    });
  },
});

export const { updateStock } = stockSlice.actions;
export default stockSlice.reducer;
