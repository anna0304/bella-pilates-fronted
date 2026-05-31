import { api } from "../api/api";

export async function getAdminPlans() {
  const response = await api.get("/admin/plans");
  return response.data;
}