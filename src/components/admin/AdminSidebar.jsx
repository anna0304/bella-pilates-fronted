import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.svg";
import homeIcon from "../../assets/casa.svg";
import usersIcon from "../../assets/perfil.svg";
import classesIcon from "../../assets/video.svg";
import scheduleIcon from "../../assets/horarios.svg";
import reservationsIcon from "../../assets/horarios.svg";
import paymentsIcon from "../../assets/policy.svg";
import reportsIcon from "../../assets/niveles.svg";
import messagesIcon from "../../assets/mail.svg";
import settingsIcon from "../../assets/candado.svg";
import logoutIcon from "../../assets/cerrarSesion.svg";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: homeIcon },
  { label: "Usuarios", path: "/admin/users", icon: usersIcon },
  { label: "Clases", path: "/admin/classes", icon: classesIcon },
  { label: "Horarios", path: "/admin/schedules", icon: scheduleIcon },
  { label: "Reservas", path: "/admin/reservations", icon: reservationsIcon },
  { label: "Clases grabadas", path: "/admin/recorded-classes", icon: classesIcon },
  { label: "Pagos", path: "/admin/payments", icon: paymentsIcon },
  { label: "Reportes", path: "/admin/reports", icon: reportsIcon },
  { label: "Mensajes", path: "/admin/messages", icon: messagesIcon },
  { label: "Ajustes", path: "/admin/settings", icon: settingsIcon },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("bella_pilates_token");
    localStorage.removeItem("bella_pilates_user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#E8DDD3] bg-[#F8F3EE] px-5 py-5">
      <div className="shrink-0">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-12 w-12" />

          <div>
            <h2 className="text-xl font-semibold text-[#2F2118]">
              Bella Pilates
            </h2>
            <p className="text-xs text-[#8B6B52]">Panel de administración</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex shrink-0 items-center gap-4 rounded-[16px] px-5 py-3.5 text-left transition ${
              isActive(item.path)
                ? "bg-[#EFE5DD] text-[#2F2118]"
                : "text-[#5A4030] hover:bg-[#EFE5DD]"
            }`}
          >
            <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="shrink-0 border-t border-[#E8DDD3] pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-[16px] px-5 py-3.5 text-[#5A4030] transition hover:bg-[#EFE5DD]"
        >
          <img src={logoutIcon} alt="" className="h-5 w-5 shrink-0" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}