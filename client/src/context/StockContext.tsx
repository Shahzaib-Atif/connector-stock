import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { MasterData, StockState, StockAction, Transaction } from "../types";
import { fetchMasterData } from "../api";
import { getStockMap } from "@/api/stockApi";
import { getTransactions } from "@/api/transactionsApi";

const initialState: StockState = {
  masterData: null,
  loading: true,
  transactions: [],
  stockCache: {},
};

const stockReducer = (state: StockState, action: StockAction): StockState => {
  switch (action.type) {
    case "INIT_DATA":
      return {
        ...state,
        masterData: action.payload,
        loading: false,
        stockCache: getStockMap(),
        transactions: getTransactions(),
      };
    case "UPDATE_STOCK":
      return {
        ...state,
        stockCache: {
          ...state.stockCache,
          [action.payload.connectorId]: action.payload.amount,
        },
        transactions: [action.payload.transaction, ...state.transactions],
      };
    default:
      return state;
  }
};

const StockContext = createContext<{
  state: StockState;
  dispatch: React.Dispatch<StockAction>;
} | null>(null);

export const StockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(stockReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMasterData();
      dispatch({ type: "INIT_DATA", payload: data });
    };
    loadData();
  }, []);

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error("useStock must be used within StockProvider");
  return context;
};
