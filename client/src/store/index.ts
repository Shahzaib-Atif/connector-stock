import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import masterDataReducer from "./slices/masterDataSlice";
import transactionsReducer from "./slices/transactionsSlice";
import samplesReducer from "./slices/samplesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    txData: transactionsReducer,
    masterData: masterDataReducer,
    samples: samplesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

