import { api } from "../api/api";

export async function getAdminReservations() {
  const response = await api.get("/admin/reservations");
  return response.data;
}

export async function createAdminReservation(data) {
  const response = await api.post("/admin/reservations", data);
  return response.data;
}

export async function updateAdminReservationStatus(reservationId, status) {
  const response = await api.patch(`/admin/reservations/${reservationId}/status`, {
    status,
  });

  return response.data;
}

export async function getAdminAvailableSchedules() {
  const response = await api.get("/admin/available-schedules");
  return response.data;
}