import { Sample } from "@/utils/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const getSamples = async (): Promise<{
  samples: Sample[];
  projects: string[];
  clients: string[];
}> => {
  const response = await fetchWithAuth(API.samples);
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
};

export const getSample = async (id: number): Promise<Sample> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch sample");
  return response.json();
};

export const createSample = async (
  sample: Omit<
    Sample,
    "ID" | "IsActive" | "DateOfCreation" | "DateOfLastUpdate"
  >
): Promise<Sample> => {
  const response = await fetchWithAuth(API.samples, {
    method: "POST",
    body: JSON.stringify(sample),
  });
  if (!response.ok) throw new Error("Failed to create sample");
  return response.json();
};

export const updateSample = async (
  id: number,
  sample: Partial<Sample>
): Promise<Sample> => {
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

export const deleteSample = async (id: number): Promise<Sample> => {
  const response = await fetchWithAuth(`${API.samples}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sample");
  return response.json();
};
