import { getAnaliseTab } from "@/api/samplesApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AnaliseState {
  rows: AnaliseTabDto[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
}

const initialState: AnaliseState = {
  rows: [],
  loading: false,
  error: null,
  hasLoaded: false,
};

export const fetchAnaliseThunk = createAsyncThunk(
  "analise/fetch",
  async () => {
    return getAnaliseTab();
  },
);

export const refreshAnaliseThunk = createAsyncThunk(
  "analise/refresh",
  async () => {
    return getAnaliseTab();
  },
);

const analiseSlice = createSlice({
  name: "analise",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnaliseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnaliseThunk.fulfilled, (state, action) => {
        state.rows = action.payload;
        state.loading = false;
        state.hasLoaded = true;
      })
      .addCase(fetchAnaliseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch AnaliseTab data";
      })
      .addCase(refreshAnaliseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAnaliseThunk.fulfilled, (state, action) => {
        state.rows = action.payload;
        state.loading = false;
        state.hasLoaded = true;
      })
      .addCase(refreshAnaliseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to refresh AnaliseTab data";
      });
  },
});

export default analiseSlice.reducer;
