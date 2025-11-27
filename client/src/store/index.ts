import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import stockReducer from './stockSlice';
import masterDataReducer from './masterDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    masterData: masterDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
