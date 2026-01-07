import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getSamples,
  createSample,
  updateSample,
  deleteSample,
} from "@/api/samplesApi";
import { Sample } from "@/utils/types/types";

interface SamplesState {
  samples: Sample[];
  projects: string[];
  clients: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SamplesState = {
  samples: [],
  projects: [],
  clients: [],
  loading: false,
  error: null,
};

// Fetch all samples
export const fetchSamplesThunk = createAsyncThunk(
  "samples/fetchAll",
  async () => {
    const samples = await getSamples();
    return samples;
  }
);

// Create a new sample
export const createSampleThunk = createAsyncThunk(
  "samples/create",
  async (
    sampleData: Omit<
      Sample,
      "ID" | "IsActive" | "DateOfCreation" | "DateOfLastUpdate"
    >
  ) => {
    const sample = await createSample(sampleData);
    return sample;
  }
);

// Update an existing sample
export const updateSampleThunk = createAsyncThunk(
  "samples/update",
  async ({ id, data }: { id: number; data: Partial<Sample> }) => {
    const sample = await updateSample(id, data);
    return sample;
  }
);

// Delete (soft delete) a sample
export const deleteSampleThunk = createAsyncThunk(
  "samples/delete",
  async (id: number) => {
    await deleteSample(id);
    return id;
  }
);

export const samplesSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch samples
      .addCase(fetchSamplesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSamplesThunk.fulfilled, (state, action) => {
        state.samples = action.payload.samples;
        state.projects = action.payload.projects;
        state.clients = action.payload.clients;
        state.loading = false;
      })
      .addCase(fetchSamplesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch samples";
      })
      // Create sample
      .addCase(createSampleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSampleThunk.fulfilled, (state, action) => {
        state.samples.unshift(action.payload); // Add to beginning
        state.loading = false;
      })
      .addCase(createSampleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sample";
      })
      // Update sample
      .addCase(updateSampleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSampleThunk.fulfilled, (state, action) => {
        const index = state.samples.findIndex(
          (s) => s.ID === action.payload.ID
        );
        if (index !== -1) {
          state.samples[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateSampleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update sample";
      })
      // Delete sample
      .addCase(deleteSampleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSampleThunk.fulfilled, (state, action) => {
        state.samples = state.samples.filter((s) => s.ID !== action.payload);
        state.loading = false;
      })
      .addCase(deleteSampleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete sample";
      });
  },
});

export default samplesSlice.reducer;
