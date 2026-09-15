import apiClient from "./client";

// Login
export const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// Get currently authenticated user
export const getMe = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};