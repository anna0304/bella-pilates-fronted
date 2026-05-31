import { api } from "../api/api";

export async function getRecordedClasses() {
  const response = await api.get("/recorded-classes");
  return response.data;
}

export async function getRecordedClass(recordedClassId) {
  const response = await api.get(`/recorded-classes/${recordedClassId}`);
  return response.data;
}