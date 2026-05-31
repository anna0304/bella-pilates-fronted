import { api } from "../api/api";

export async function getMyReservations() {
  const response = await api.get("/my-reservations");
  return response.data;
}

export async function getAvailableSchedules() {
  const response = await api.get("/available-schedules");
  return response.data;
}

export async function createMyReservation(data) {
  const response = await api.post("/reservations", data);
  return response.data;
}

export async function cancelMyReservation(reservationId) {
  const response = await api.patch(`/reservations/${reservationId}/cancel`);
  return response.data;
}