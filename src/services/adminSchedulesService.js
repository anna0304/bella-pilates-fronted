import { api } from "../api/api";

export async function getAdminSchedules() {
  const response = await api.get("/admin/schedules");
  return response.data;
}

export async function createAdminSchedule(data) {
  const response = await api.post("/admin/schedules", data);
  return response.data;
}

export async function updateAdminSchedule(scheduleId, data) {
  const response = await api.put(`/admin/schedules/${scheduleId}`, data);
  return response.data;
}

export async function deactivateAdminSchedule(scheduleId) {
  const response = await api.patch(`/admin/schedules/${scheduleId}/deactivate`);
  return response.data;
}