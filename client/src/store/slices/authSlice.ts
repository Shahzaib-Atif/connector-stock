import { fetchUsersApi } from "@/api/authApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  username: string;
  role: "Master Admin" | "Normal User";
}

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  role: "Master Admin" | "Normal User" | null;
  token?: string;
  users: UserInfo[];
  loading?: boolean;
  error?: string | null;
}

const SESSION_KEY = "connector_stock_session_v1";

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

export const initUsersList = createAsyncThunk("usersList/init", async () => {
  const serializedState = localStorage.getItem(SESSION_KEY);
  if (serializedState != null) {
    const state = JSON.parse(serializedState);
    return await fetchUsersApi(state.token);
  }

  return [];
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: string;
        role: "Master Admin" | "Normal User";
        token: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          role: state.role,
          token: state.token,
        })
      );
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initUsersList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(initUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users list";
      });
  },
});

export const { login, logout, setUsersList } = authSlice.actions;
export default authSlice.reducer;
