import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import masterDataReducer from "./slices/masterDataSlice";
import transactionsReducer from "./slices/transactionsSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    txData: transactionsReducer,
    masterData: masterDataReducer,
    notifications: notificationsReducer,
  },
  // Large table datasets make Redux dev-time checks and DevTools snapshots
  // noticeably expensive during normal navigation and UI interaction.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

