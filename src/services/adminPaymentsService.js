import { api } from "../api/api";

export async function getAdminPayments() {
  const response = await api.get("/admin/payments");
  return response.data;
}

export async function createAdminPayment(data) {
  const response = await api.post("/admin/payments", data);
  return response.data;
}

export async function updateAdminPaymentStatus(paymentId, status) {
  const response = await api.patch(`/admin/payments/${paymentId}/status`, {
    status,
  });

  return response.data;
}