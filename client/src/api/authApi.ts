import { User } from "@/types";
import { API } from "../utils/api";
import { fetchWithAuth } from "../utils/fetchClient";

export const loginApi = async (username: string, password: string) => {
  const response = await fetch(API.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    if (response.status == 500) throw new Error("Server is not responding!");
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const fetchUsersApi = async (): Promise<User[]> => {
  const response = await fetchWithAuth(API.users);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUserApi = async (userData: User) => {
  const response = await fetchWithAuth(API.users, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};

export const deleteUserApi = async (userId: number) => {
  const response = await fetchWithAuth(`${API.users}/delete/${userId}`, {
    method: "POST", // Backend uses POST for delete right now
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};

export const changePasswordApi = async (newPassword: string) => {
  const response = await fetchWithAuth(API.changePwd, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }

  return response.json();
};
