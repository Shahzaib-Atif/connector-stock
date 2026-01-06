import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import masterDataReducer from "./slices/masterDataSlice";
import transactionsReducer from "./slices/transactionsSlice";
import samplesReducer from "./slices/samplesSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    txData: transactionsReducer,
    masterData: masterDataReducer,
    samples: samplesReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

