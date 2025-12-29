import { API } from "../utils/api";
import { UserInfo } from "../store/slices/authSlice";

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

export const fetchUsersApi = async (token: string): Promise<UserInfo[]> => {
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
