import { api } from "../api/api";

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function createAdminUser(data) {
  const response = await api.post("/admin/users", data);
  return response.data;
}

export async function updateAdminUser(userId, data) {
  const response = await api.put(`/admin/users/${userId}`, data);
  return response.data;
}

export async function deactivateAdminUser(userId) {
  const response = await api.patch(`/admin/users/${userId}/deactivate`);
  return response.data;
}

export async function resetAdminUserPassword(userId) {
  const response = await api.patch(`/admin/users/${userId}/reset-password`);
  return response.data;
}