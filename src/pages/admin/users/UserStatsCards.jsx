import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import usersIcon from "../../../assets/perfil.svg";
import calendarIcon from "../../../assets/horarios.svg";
import policyIcon from "../../../assets/policy.svg";

export function UserStatsCards({ users }) {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "Activo").length;
  const inactiveUsers = users.filter((user) => user.status === "Inactivo").length;

  const stats = [
    {
      icon: usersIcon,
      title: "Total usuarios",
      value: totalUsers,
      percentage: "+12%",
      comparison: "vs. mes anterior",
    },
    {
      icon: usersIcon,
      title: "Usuarios activos",
      value: activeUsers,
      percentage: "+9%",
      comparison: "vs. mes anterior",
    },
    {
      icon: calendarIcon,
      title: "Usuarios nuevos",
      value: "28",
      percentage: "+18%",
      comparison: "vs. mes anterior",
    },
    {
      icon: policyIcon,
      title: "Inactivos",
      value: inactiveUsers,
      percentage: "-5%",
      comparison: "vs. mes anterior",
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