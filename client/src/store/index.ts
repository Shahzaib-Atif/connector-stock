import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import masterDataReducer from "./slices/masterDataSlice";
import transactionsReducer from "./slices/transactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    txData: transactionsReducer,
    masterData: masterDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
