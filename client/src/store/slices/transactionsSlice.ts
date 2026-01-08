import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTransaction, getTransactions } from "@/api/transactionsApi";
import { RootState } from "@/store";
import {
  AccessoryApiResponse,
  Connector,
  Transaction,
} from "@/utils/types/types";
import { updateAccessory, updateConnector } from "./masterDataSlice";

interface TransactionState {
  transactions: Transaction[];
  lastConnector: Connector | null;
  lastAccessory: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  lastConnector: null,
  lastAccessory: null,
  loading: false,
  error: null,
};

export const performTransactionThunk = createAsyncThunk(
  "transactions/perform",
  async (
    {
      itemId,
      delta,
      department,
    }: { itemId: string; delta: number; department?: string },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const masterData = state.masterData.data!;
    const isAccessory = itemId.includes("_");

    const txData: Omit<Transaction, "ID" | "updatedAt"> = {
      itemId,
      transactionType: delta > 0 ? "IN" : "OUT",
      amount: Math.abs(delta),
      itemType: isAccessory ? "accessory" : "connector",
      department,
    };

    const transaction = await createTransaction(txData);

    // Compute updated accessory if this is an accessory transaction
    let accessory: AccessoryApiResponse = null;
    let connector: Connector = null;

    if (isAccessory) {
      // update masterData accessory
      accessory = masterData.accessories[itemId];
      dispatch(
        updateAccessory({
          itemId,
          accessory: { ...accessory, Qty: accessory.Qty + delta },
        })
      );
    } else {
      // update masterData connector
      connector = masterData.connectors[itemId];
      dispatch(
        updateConnector({
          itemId,
          connector: { ...connector, Qty: (connector.Qty ?? 0) + delta },
        })
      );
    }

    return { connector, accessory, transaction };
  }
);

// Loads stock map and transactions into initial Redux state.
export const initTransactionsData = createAsyncThunk(
  "transactions/init",
  async () => {
    const transactions = await getTransactions();
    return { transactions };
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // You can add manual reducers later if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(performTransactionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performTransactionThunk.fulfilled, (state, action) => {
        const { connector, accessory, transaction } = action.payload;

        // Store the new transaction
        state.transactions.push(transaction);

        // Store the parsed connector/accessory for any UI updates
        state.lastConnector = connector;
        state.lastAccessory = accessory;

        state.loading = false;
      })
      .addCase(performTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Transaction failed";
      })
      .addCase(initTransactionsData.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
      });
  },
});

export default transactionsSlice.reducer;
