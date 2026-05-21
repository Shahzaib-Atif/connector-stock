import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { RegAmostrasOrcDto } from "@shared/dto/RegAmostrasOrcDto";
import { SamplesQueryDto } from "@shared/dto/SamplesQueryDto";
import { SamplesPageDto } from "@shared/dto/SamplesPageDto";
import { SamplesOptionsDto } from "@shared/dto/SamplesOptionsDto";

// Fetches one sample record by database id.
export const getSample = async (id: number): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch sample");
  return response.json();
};

// Fetches paginated samples from server cache.
export const getSamples = async (
  query: SamplesQueryDto,
  signal?: AbortSignal,
): Promise<SamplesPageDto> => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const response = await fetchWithAuth(`${API.samples}?${params.toString()}`, {
    signal,
  });
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
};

// Fetches autocomplete options for sample forms.
export const getSamplesOptions = async (): Promise<SamplesOptionsDto> => {
  const response = await fetchWithAuth(`${API.samples}/options`);
  if (!response.ok) throw new Error("Failed to fetch sample options");
  return response.json();
};

// Triggers server samples cache invalidation and refresh.
export const refreshSamplesCache = async () => {
  const response = await fetchWithAuth(`${API.samples}/refresh`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh samples cache");
  }

  return response.json();
};

// Creates a new sample via authenticated API.
export const createSample = async (
  sample: CreateSamplesDto,
): Promise<SamplesDto> => {
  const response = await fetchWithAuth(API.samples, {
    method: "POST",
    body: JSON.stringify(sample),
  });
  if (!response.ok) throw new Error("Failed to create sample");
  return response.json();
};

// Updates an existing sample by id.
export const updateSample = async (
  id: number,
  sample: CreateSamplesDto,
): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`, {
    method: "PUT",
    body: JSON.stringify(sample),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update sample");
  }

  return response.json();
};

// Soft-deletes a sample by id.
export const deleteSample = async (id: number): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sample");
  return response.json();
};

// Searches cached ORC rows for wizard lookup.
export const searchOrcSamples = async (
  query: string,
): Promise<RegAmostrasOrcDto[]> => {
  const params = new URLSearchParams({ query });
  const response = await fetchWithAuth(
    `${API.samples}/orc-search?${params.toString()}`,
  );
  if (!response.ok) throw new Error("Failed to search ORC samples");
  return response.json();
};
