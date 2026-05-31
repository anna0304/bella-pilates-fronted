import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import usersIcon from "../../../assets/perfil.svg";
import calendarIcon from "../../../assets/horarios.svg";
import paymentIcon from "../../../assets/policy.svg";
import videoIcon from "../../../assets/video.svg";
import favoriteIcon from "../../../assets/bienestar.svg";

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export function ReportStatsCards({ stats }) {
  const safeStats = stats || {
    activeUsers: 0,
    monthReservations: 0,
    monthIncome: 0,
    recordedViews: 0,
    attendanceRate: 0,
  };

  const cards = [
    {
      icon: usersIcon,
      title: "Usuarios activos",
      value: safeStats.activeUsers,
      percentage: "Actual",
      comparison: "usuarios activos",
    },
    {
      icon: calendarIcon,
      title: "Reservas este mes",
      value: safeStats.monthReservations,
      percentage: "Mes actual",
      comparison: "reservas registradas",
    },
    {
      icon: paymentIcon,
      title: "Ingresos este mes",
      value: formatMoney(safeStats.monthIncome),
      percentage: "Pagos completados",
      comparison: "mes actual",
    },
    {
      icon: videoIcon,
      title: "Clases grabadas vistas",
      value: safeStats.recordedViews,
      percentage: "Visualizaciones",
      comparison: "total registrado",
    },
    {
      icon: favoriteIcon,
      title: "Tasa de asistencia",
      value: `${safeStats.attendanceRate}%`,
      percentage: "Asistencia",
      comparison: "clases completadas",
    },
  ];

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((stat) => (
        <AdminStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}