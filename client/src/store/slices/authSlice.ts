import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
  id: string;
  username: string;
  role: 'Master Admin' | 'Normal User';
}

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  role: 'Master Admin' | 'Normal User' | null;
  token?: string; // Simulating a JWT or session token
  users: UserInfo[];
}

const SESSION_KEY = 'connector_stock_session_v1';

const loadSession = (): AuthState => {
  try {
    const serializedState = localStorage.getItem(SESSION_KEY);
    if (serializedState === null) {
      return { isAuthenticated: false, user: null, role: null, users: [] };
    }
    const state = JSON.parse(serializedState);
    return { ...state, users: state.users || [] };
  } catch (err) {
    console.warn("Failed to load session from local storage", err);
    return { isAuthenticated: false, user: null, role: null, users: [] };
  }
};

const initialState: AuthState = loadSession();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: string, role: 'Master Admin' | 'Normal User', token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
      
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
        token: state.token
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = undefined;
      state.users = [];
      localStorage.removeItem(SESSION_KEY);
    },
    setUsersList: (state, action: PayloadAction<UserInfo[]>) => {
      state.users = action.payload;
    }
  },
});

export const { login, logout, setUsersList } = authSlice.actions;
export default authSlice.reducer;