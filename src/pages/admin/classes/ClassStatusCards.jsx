import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import classesIcon from "../../../assets/niveles.svg";
import videoIcon from "../../../assets/video.svg";
import clockIcon from "../../../assets/reloj.svg";
import policyIcon from "../../../assets/policy.svg";

export function ClassStatusCards({ classes }) {
  const totalClasses = classes.length;
  const activeClasses = classes.filter((item) => item.status === "Activa").length;
  const beginnerClasses = classes.filter(
    (item) => item.level === "Principiante",
  ).length;

  const stats = [
    {
      icon: classesIcon,
      title: "Total clases",
      value: totalClasses,
      percentage: "+8%",
      comparison: "vs. mes anterior",
    },
    {
      icon: videoIcon,
      title: "Clases activas",
      value: activeClasses,
      percentage: "+5%",
      comparison: "vs. mes anterior",
    },
    {
      icon: policyIcon,
      title: "Principiantes",
      value: beginnerClasses,
      percentage: "+12%",
      comparison: "vs. mes anterior",
    },
    {
      icon: clockIcon,
      title: "Duración media",
      value: "52 min",
      percentage: "+3%",
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