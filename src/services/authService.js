import { api } from "../api/api";

export async function login(credentials) {
  const response = await api.post("/login", credentials);
  return response.data;
}

export async function logout() {
  const response = await api.post("/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/me");
  return response.data;
}

export async function changePassword(data) {
  const response = await api.patch("/change-password", data);
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.patch("/profile", data);
  return response.data;
}