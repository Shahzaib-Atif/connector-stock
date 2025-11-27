import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MasterData } from "../types";
import { fetchMasterData } from "../api";

interface MasterDataState {
  data: MasterData | null;
  loading: boolean;
  error: string | null;
}

const initialState: MasterDataState = {
  data: null,
  loading: true,
  error: null,
};

export const initMasterData = createAsyncThunk(
  "masterData/init",
  async () => {
    const data = await fetchMasterData();
    return data;
  }
);

export const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initMasterData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(initMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load master data";
      });
  },
});

export default masterDataSlice.reducer;
