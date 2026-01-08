import { fetchMasterData } from "@/api";
import {
  AccessoryApiResponse,
  Connector,
  MasterData,
} from "@/utils/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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

export const initMasterData = createAsyncThunk("masterData/init", async () => {
  const data = await fetchMasterData();
  return data;
});

export const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    updateConnector: (
      state,
      action: PayloadAction<{
        itemId: string;
        connector: Connector;
      }>
    ) => {
      const { itemId, connector } = action.payload;
      if (!state.data) return;
      state.data.connectors[itemId] = connector;
    },
    updateAccessory: (
      state,
      action: PayloadAction<{ itemId: string; accessory: AccessoryApiResponse }>
    ) => {
      const { itemId, accessory } = action.payload;
      if (!state.data) return;
      state.data.accessories[itemId] = accessory;
    },
  },
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

export const { updateConnector, updateAccessory } = masterDataSlice.actions;
export default masterDataSlice.reducer;
