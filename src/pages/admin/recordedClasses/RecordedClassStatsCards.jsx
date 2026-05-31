import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import videoIcon from "../../../assets/video.svg";
import eyeIcon from "../../../assets/ojo.svg";
import clockIcon from "../../../assets/reloj.svg";
import folderIcon from "../../../assets/policy.svg";

export function RecordedClassStatsCards({ videos }) {
  const totalVideos = videos.length;
  const totalViews = videos.reduce((acc, video) => acc + video.views, 0);
  const categories = new Set(videos.map((video) => video.category)).size;

  const stats = [
    {
      icon: videoIcon,
      title: "Total clases grabadas",
      value: totalVideos,
      percentage: "+15%",
      comparison: "vs. mes anterior",
    },
    {
      icon: eyeIcon,
      title: "Visualizaciones totales",
      value: totalViews,
      percentage: "+28%",
      comparison: "vs. mes anterior",
    },
    {
      icon: clockIcon,
      title: "Duración total",
      value: "42h 36m",
      percentage: "+8%",
      comparison: "tiempo de contenido",
    },
    {
      icon: folderIcon,
      title: "Categorías",
      value: categories,
      percentage: "+2",
      comparison: "organizadas",
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