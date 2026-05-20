import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { RegAmostrasOrcDto } from "@shared/dto/RegAmostrasOrcDto";
import { AnaliseTabQueryDto } from "@shared/dto/AnaliseTabQueryDto";
import { AnaliseTabPageDto } from "@shared/dto/AnaliseTabPageDto";

export const getSamples = async (): Promise<{
  samples: SamplesDto[];
  projects: string[];
  clients: string[];
}> => {
  const response = await fetchWithAuth(API.samples);
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
};

export const getSample = async (id: number): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch sample");
  return response.json();
};

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

export const deleteSample = async (id: number): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const getAllSamplesFromORC = async (): Promise<RegAmostrasOrcDto[]> => {
  const response = await fetchWithAuth(`${API.samples}/all-from-orc`);
  if (!response.ok) throw new Error("Failed to fetch all ORC samples");
  return response.json();
};

export const getAnaliseTab = async (
  query: AnaliseTabQueryDto,
  signal?: AbortSignal,
): Promise<AnaliseTabPageDto> => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const response = await fetchWithAuth(
    `${API.samples}/analise-tab?${params.toString()}`,
    { signal },
  );
  if (!response.ok) throw new Error("Failed to fetch AnaliseTab data");
  return response.json();
};

export const refreshAnaliseTabCache = async () => {
  const response = await fetchWithAuth(`${API.samples}/analise-tab/refresh`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh AnaliseTab cache");
  }

  return response.json();
};
