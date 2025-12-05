import { Sample } from "@/types";
import { API } from "@/utils/api";

export const getSamples = async (): Promise<Sample[]> => {
  const response = await fetch(API.samples);
  if (!response.ok) throw new Error("Failed to fetch samples");
  return response.json();
};

export const getSample = async (id: number): Promise<Sample> => {
  const response = await fetch(`${API.samples}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch sample");
  return response.json();
};

export const createSample = async (
  sample: Omit<Sample, "ID" | "IsActive" | "DateOfCreation" | "DateOfLastUpdate">
): Promise<Sample> => {
  const response = await fetch(API.samples, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sample),
  });
  if (!response.ok) throw new Error("Failed to create sample");
  return response.json();
};

export const updateSample = async (
  id: number,
  sample: Partial<Sample>
): Promise<Sample> => {
  const response = await fetch(`${API.samples}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sample),
  });
  if (!response.ok) throw new Error("Failed to update sample");
  return response.json();
};

export const deleteSample = async (id: number): Promise<Sample> => {
  const response = await fetch(`${API.samples}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sample");
  return response.json();
};
