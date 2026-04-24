import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { RegAmostrasOrcDto } from "@shared/dto/RegAmostrasOrcDto";

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
  sample: SamplesDto,
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
