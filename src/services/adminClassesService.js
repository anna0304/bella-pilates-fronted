import { api } from "../api/api";

export async function getAdminClasses() {
  const response = await api.get("/admin/classes");
  return response.data;
}

export async function createAdminClass(data) {
  const response = await api.post("/admin/classes", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateAdminClass(classId, data) {
  data.append("_method", "PUT");

  const response = await api.post(`/admin/classes/${classId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deactivateAdminClass(classId) {
  const response = await api.patch(`/admin/classes/${classId}/deactivate`);
  return response.data;
}