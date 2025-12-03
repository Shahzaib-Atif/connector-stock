import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  token?: string; // Simulating a JWT or session token
}

const SESSION_KEY = 'connector_stock_session_v1';

const loadSession = (): AuthState => {
  try {
    const serializedState = localStorage.getItem(SESSION_KEY);
    if (serializedState === null) {
      return { isAuthenticated: false, user: null };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn("Failed to load session from local storage", err);
    return { isAuthenticated: false, user: null };
  }
};

const initialState: AuthState = loadSession();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      // Create a mock JWT-like token
      state.token = btoa(JSON.stringify({ 
        sub: action.payload.user, 
        iat: Date.now(), 
        exp: Date.now() + (1000 * 60 * 60 * 24) // 24 hours
      }));
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = undefined;
      localStorage.removeItem(SESSION_KEY);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;