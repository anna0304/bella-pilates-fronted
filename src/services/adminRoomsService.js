import { api } from "../api/api";

export async function getAdminRooms() {
  const response = await api.get("/admin/rooms");
  return response.data;
}