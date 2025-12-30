import { User } from "@/types";
import { API } from "../utils/api";

export const loginApi = async (username: string, password: string) => {
  const response = await fetch(API.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const fetchUsersApi = async (token: string): Promise<User[]> => {
  const response = await fetch(API.users, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUserApi = async (token: string, userData: User) => {
  const response = await fetch(API.users, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};

export const deleteUserApi = async (token: string, userId: number) => {
  const response = await fetch(`${API.users}/delete/${userId}`, {
    method: "POST", // Backend uses POST for delete right now
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};

export const changePasswordApi = async (token: string, newPassword: string) => {
  const response = await fetch(API.changePwd, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }

  return response.json();
};
