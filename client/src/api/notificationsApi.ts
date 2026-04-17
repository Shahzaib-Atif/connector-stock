import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";
import { AppNotification } from "@shared/types/Notification";

export const getUnfinishedNotifications = async (): Promise<
  AppNotification[]
> => {
  const response = await fetchWithAuth(API.notifications);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
};

export const getNotificationWithSample = async (
  id: number,
): Promise<AppNotification> => {
  const response = await fetchWithAuth(`${API.notifications}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch notification");
  return response.json();
};

export const finishNotification = async (
  id: number,
  quantityTakenOut: number,
  finishedBy?: string,
  completionNote?: string,
): Promise<void> => {
  const response = await fetchWithAuth(`${API.notifications}/${id}/finish`, {
    method: "PATCH",
    body: JSON.stringify({ quantityTakenOut, finishedBy, completionNote }),
  });
  if (!response.ok) throw new Error("Failed to finish notification");
  return response.json();
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`${API.notifications}/${id}/read`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
  return response.json();
};
