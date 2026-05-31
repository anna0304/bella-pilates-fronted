import { api } from "../api/api";

export async function getAdminMessages() {
  const response = await api.get("/admin/messages");
  return response.data;
}

export async function markAdminMessageAsRead(messageId) {
  const response = await api.patch(`/admin/messages/${messageId}/read`);
  return response.data;
}

export async function archiveAdminMessage(messageId) {
  const response = await api.patch(`/admin/messages/${messageId}/archive`);
  return response.data;
}

export async function unarchiveAdminMessage(messageId) {
  const response = await api.patch(`/admin/messages/${messageId}/unarchive`);
  return response.data;
}

export async function markAdminMessageAsUnread(messageId) {
  const response = await api.patch(`/admin/messages/${messageId}/unread`);
  return response.data;
}