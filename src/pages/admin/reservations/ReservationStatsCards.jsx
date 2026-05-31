import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import calendarIcon from "../../../assets/horarios.svg";
import usersIcon from "../../../assets/perfil.svg";
import clockIcon from "../../../assets/reloj.svg";
import policyIcon from "../../../assets/policy.svg";

function isToday(dateValue) {
  if (!dateValue || dateValue === "—") return false;

  const today = new Date();
  const date = new Date(dateValue);

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getPercentage(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function ReservationStatsCards({ reservations }) {
  const total = reservations.length;

  const todayReservations = reservations.filter((reservation) =>
    isToday(reservation.raw?.created_at),
  ).length;

  const confirmed = reservations.filter(
    (reservation) => reservation.status === "Confirmada",
  ).length;

  const cancelled = reservations.filter(
    (reservation) => reservation.status === "Cancelada",
  ).length;

  const completed = reservations.filter(
    (reservation) => reservation.status === "Completada",
  ).length;

  const stats = [
    {
      icon: calendarIcon,
      title: "Reservas hoy",
      value: todayReservations,
      percentage: getPercentage(todayReservations, total),
      comparison: "del total",
    },
    {
      icon: usersIcon,
      title: "Confirmadas",
      value: confirmed,
      percentage: getPercentage(confirmed, total),
      comparison: "del total",
    },
    {
      icon: policyIcon,
      title: "Canceladas",
      value: cancelled,
      percentage: getPercentage(cancelled, total),
      comparison: "del total",
    },
    {
      icon: clockIcon,
      title: "Completadas",
      value: completed,
      percentage: getPercentage(completed, total),
      comparison: "del total",
    },
  ];

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AdminStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}