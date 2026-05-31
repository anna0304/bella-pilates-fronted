import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import classIcon from "../../../assets/niveles.svg";
import policyIcon from "../../../assets/policy.svg";

export function ScheduleStatsCards({ schedules }) {
  const totalSchedules = schedules.length;

  const programmed = schedules.filter(
    (item) => item.status === "Programado",
  ).length;

  const cancelled = schedules.filter(
    (item) => item.status === "Cancelado",
  ).length;

  const totalBooked = schedules.reduce(
    (acc, item) => acc + Number(item.booked || 0),
    0,
  );

  const stats = [
    {
      icon: calendarIcon,
      title: "Total horarios",
      value: totalSchedules,
      percentage: "",
      comparison: "Según horarios registrados",
    },
    {
      icon: classIcon,
      title: "Programados",
      value: programmed,
      percentage: "",
      comparison: "Según estado actual",
    },
    {
      icon: policyIcon,
      title: "Cancelados",
      value: cancelled,
      percentage: "",
      comparison: "Según estado actual",
    },
    {
      icon: clockIcon,
      title: "Reservas asignadas",
      value: totalBooked,
      percentage: "",
      comparison: "Según reservas registradas",
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