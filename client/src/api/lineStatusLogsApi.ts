import { API } from "@/utils/api";
import { CreateLineStatusLogDto } from "@shared/dto/CreateLineStatusLogDto";
import { CreateUpdateConnNameLogDto } from "@shared/dto/CreateUpdateConnNameLogDto";

export const createLineStatusLog = async (payload: CreateLineStatusLogDto) => {
  const response = await fetch(API.lineStatusLogs, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create line status log");
  }

  return await response.json();
};

export const createUpdateConnNameLog = async (
  payload: CreateUpdateConnNameLogDto,
) => {
  const response = await fetch(`${API.lineStatusLogs}/update-conn-name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create update connector name log");
  }

  return await response.json();
};
