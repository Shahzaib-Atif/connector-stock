import {
  changePasswordApi,
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
} from "@/api/authApi";
import { STORAGE_KEYS } from "@/utils/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDto } from "@shared/dto/UserDto";
import { UserRoles } from "@shared/enums/UserRoles";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  role: UserRoles | null;
  token?: string;
  users: UserDto[];
  loading?: boolean;
  error?: string | null;
}

const STORAGE_KEY = STORAGE_KEYS.SESSION;

const loadSession = (): AuthState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
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
  return await fetchUsersApi();
});

export const refreshUsersList = createAsyncThunk(
  "usersList/refresh",
  async () => {
    return await fetchUsersApi();
  },
);

export const createUserThunk = createAsyncThunk(
  "usersList/create",
  async (userData: UserDto, { dispatch }) => {
    const result = await createUserApi(userData);
    dispatch(initUsersList());
    return result;
  },
);

export const deleteUserThunk = createAsyncThunk(
  "usersList/delete",
  async (userId: number, { dispatch }) => {
    const result = await deleteUserApi(userId);
    dispatch(initUsersList());
    return result;
  },
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (newPassword: string) => {
    return await changePasswordApi(newPassword);
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: string;
        role: UserRoles;
        token: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          role: state.role,
          token: state.token,
        }),
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = undefined;
      state.users = [];
      localStorage.removeItem(STORAGE_KEY);
    },
    setUsersList: (state, action: PayloadAction<UserDto[]>) => {
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
      })
      .addCase(refreshUsersList.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(refreshUsersList.rejected, (state, action) => {
        state.error = action.error.message || "Failed to refresh users list";
      });
  },
});

export const { login, logout, setUsersList } = authSlice.actions;
export default authSlice.reducer;
