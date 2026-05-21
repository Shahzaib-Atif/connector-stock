import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { AnaliseSimilarQueryDto } from "@shared/dto/AnaliseSimilarQueryDto";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { AnaliseTabPageDto } from "@shared/dto/AnaliseTabPageDto";
import { AnaliseTabQueryDto } from "@shared/dto/AnaliseTabQueryDto";

// Fetches paginated analise rows from server cache.
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

// Fetches analise rows matching order, status, client, project.
export const getSimilarAnaliseRows = async (
  query: AnaliseSimilarQueryDto,
): Promise<AnaliseTabDto[]> => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const response = await fetchWithAuth(
    `${API.samples}/analise-tab/similar?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch similar AnaliseTab rows");
  }
  return response.json();
};

// Triggers server analise cache invalidation and refresh.
export const refreshAnaliseTabCache = async () => {
  const response = await fetchWithAuth(`${API.samples}/analise-tab/refresh`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh AnaliseTab cache");
  }

  return response.json();
};
