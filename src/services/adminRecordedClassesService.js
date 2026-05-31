import { api } from "../api/api";

export async function getAdminRecordedClasses() {
  const response = await api.get("/admin/recorded-classes");
  return response.data;
}

export async function createAdminRecordedClass(data) {
  const response = await api.post("/admin/recorded-classes", data);
  return response.data;
}

export async function updateAdminRecordedClass(recordedClassId, data) {
  const response = await api.put(`/admin/recorded-classes/${recordedClassId}`, data);
  return response.data;
}

export async function deactivateAdminRecordedClass(recordedClassId) {
  const response = await api.patch(
    `/admin/recorded-classes/${recordedClassId}/deactivate`,
  );

  return response.data;
}