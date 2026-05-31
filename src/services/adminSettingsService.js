import { api } from "../api/api";

export async function getAdminSettings() {
  const response = await api.get("/admin/settings");
  return response.data;
}

export async function updateAdminSettings(data) {
  const response = await api.put("/admin/settings", data);
  return response.data;
}