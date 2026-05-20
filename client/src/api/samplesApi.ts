import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { RegAmostrasOrcDto } from "@shared/dto/RegAmostrasOrcDto";
import { AnaliseTabQueryDto } from "@shared/dto/AnaliseTabQueryDto";
import { AnaliseTabPageDto } from "@shared/dto/AnaliseTabPageDto";
import { SamplesQueryDto } from "@shared/dto/SamplesQueryDto";
import { SamplesPageDto } from "@shared/dto/SamplesPageDto";
import { SamplesOptionsDto } from "@shared/dto/SamplesOptionsDto";

export const getSample = async (id: number): Promise<SamplesDto> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch sample");
  return response.json();
};

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

  const response = await fetchWithAuth(
    `${API.samples}?${params.toString()}`,
    { signal },
  );
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
};

export const getSamplesOptions = async (): Promise<SamplesOptionsDto> => {
  const response = await fetchWithAuth(`${API.samples}/options`);
  if (!response.ok) throw new Error("Failed to fetch sample options");
  return response.json();
};

export const refreshSamplesCache = async () => {
  const response = await fetchWithAuth(`${API.samples}/refresh`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh samples cache");
  }

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
  if (!response.ok) throw new Error("Failed to delete sample");
  return response.json();
};

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
