import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTransaction, getTransactions } from "@/api/transactionsApi";
import { RootState } from "@/store";
import { AccessoryExtended, ConnectorExtended } from "@/utils/types";
import { updateAccessory, updateConnector } from "./masterDataSlice";
import { Transaction } from "@shared/types/Transaction";
import { WireTypes } from "@shared/enums/WireTypes";

interface TransactionState {
  transactions: Transaction[];
  lastConnector: ConnectorExtended | null;
  lastAccessory: AccessoryExtended | null;
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

interface TxThunkProps {
  itemId: string | number;
  delta: number;
  isConnector: boolean;
  department?: string;
  subType?: string;
  encomenda?: string;
}

export const performTransactionThunk = createAsyncThunk(
  "transactions/perform",
  async (
    {
      itemId,
      delta,
      isConnector,
      department,
      subType,
      encomenda,
    }: TxThunkProps,
    { getState, dispatch },
  ) => {
    const state = getState() as RootState;
    const masterData = state.masterData.data!;

    const txData: Omit<Transaction, "ID" | "updatedAt"> = {
      itemId: itemId.toString(),
      transactionType: delta > 0 ? "IN" : "OUT",
      amount: Math.abs(delta),
      itemType: isConnector ? "connector" : "accessory",
      subType: subType as WireTypes,
      encomenda,
      department,
    };

    const transaction = await createTransaction(txData);

    // Compute updated accessory if this is an accessory transaction
    let accessory: AccessoryExtended | null = null;
    let connector: ConnectorExtended | null = null;

    // update masterData accessory
    if (!isConnector && typeof itemId === "number") {
      // update masterData accessory
      accessory = masterData.accessories[itemId];
      dispatch(
        updateAccessory({
          itemId,
          accessory: { ...accessory, Qty: accessory.Qty + delta },
        }),
      );
    } else {
      // update masterData connector
      connector = masterData.connectors[itemId];
      const updatedConnector = {
        ...connector,
        Qty: (connector.Qty ?? 0) + delta,
      };

      if (subType === WireTypes.COM_FIO) {
        updatedConnector.Qty_com_fio = (connector.Qty_com_fio ?? 0) + delta;
      } else if (subType === WireTypes.SEM_FIO) {
        updatedConnector.Qty_sem_fio = (connector.Qty_sem_fio ?? 0) + delta;
      }

      dispatch(
        updateConnector({
          itemId: itemId?.toString(),
          connector: updatedConnector,
        }),
      );
    }

    return { connector, accessory, transaction };
  },
);

// Loads stock map and transactions into initial Redux state.
export const initTransactionsData = createAsyncThunk(
  "transactions/init",
  async () => {
    const transactions = await getTransactions();
    return { transactions };
  },
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
      .addCase(initTransactionsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initTransactionsData.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
        state.loading = false;
      })
      .addCase(initTransactionsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load transactions";
      });
  },
});

export default transactionsSlice.reducer;
