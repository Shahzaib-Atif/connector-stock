import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSamples,
  createSample,
  updateSample,
  deleteSample,
  getAllSamplesFromORC,
} from "@/api/samplesApi";
import { RegAmostrasOrcRow } from "@/types/sampleCreation";
import { setLineStatus } from "@/utils/inventoryUtils";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";

interface SamplesState {
  samples: SamplesDto[];
  orcSamples: RegAmostrasOrcRow[];
  projects: string[];
  clients: string[];
  loading: boolean;
  orcLoading: boolean;
  error: string | null;
}

const initialState: SamplesState = {
  samples: [],
  orcSamples: [],
  projects: [],
  clients: [],
  loading: false,
  orcLoading: false,
  error: null,
};

// Fetch all samples
export const fetchSamplesThunk = createAsyncThunk(
  "samples/fetchAll",
  async () => {
    const samples = await getSamples();
    return samples;
  },
);

// Fetch all ORC samples for caching
export const fetchOrcSamplesThunk = createAsyncThunk(
  "samples/fetchOrcSamples",
  async () => {
    const samples = await getAllSamplesFromORC();
    return samples;
  },
);

// Create a new sample
export const createSampleThunk = createAsyncThunk(
  "samples/create",
  async (sampleData: CreateSamplesDto) => {
    const sample = await createSample(sampleData); // create sample
    setLineStatus(sample.EncDivmac, sample.Ref_Descricao);
    return sample;
  },
);

// Update an existing sample
export const updateSampleThunk = createAsyncThunk(
  "samples/update",
  async ({ id, data }: { id: number; data: SamplesDto }) => {
    const sample = await updateSample(id, data);
    return sample;
  },
);

// Delete (soft delete) a sample
export const deleteSampleThunk = createAsyncThunk(
  "samples/delete",
  async (id: number | undefined, { rejectWithValue }) => {
    if (id == null) {
      return rejectWithValue("Missing sample id");
    }
    await deleteSample(id);
    return id;
  },
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
          (s) => s.ID === action.payload.ID,
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
      })
      // Fetch ORC samples
      .addCase(fetchOrcSamplesThunk.pending, (state) => {
        state.orcLoading = true;
      })
      .addCase(fetchOrcSamplesThunk.fulfilled, (state, action) => {
        state.orcSamples = action.payload;
        state.orcLoading = false;
      })
      .addCase(fetchOrcSamplesThunk.rejected, (state) => {
        state.orcLoading = false;
      });
  },
});

export default samplesSlice.reducer;
