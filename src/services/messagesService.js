import { api } from "../api/api";

export async function sendMessage(data) {
  const response = await api.post("/messages", data);
  return response.data;
}