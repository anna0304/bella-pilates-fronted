import { api } from "../api/api";

export async function getMyFavorites() {
  const response = await api.get("/my-favorites");
  return response.data;
}

export async function addFavorite(recordedClassId) {
  const response = await api.post(`/favorites/${recordedClassId}`);
  return response.data;
}

export async function removeFavorite(recordedClassId) {
  const response = await api.delete(`/favorites/${recordedClassId}`);
  return response.data;
}