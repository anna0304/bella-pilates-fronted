import { useLocation, useNavigate } from "react-router-dom";

import homeIcon from "../../assets/casa.svg";
import reservationsIcon from "../../assets/horarios.svg";
import videoIcon from "../../assets/video.svg";
import favoritesIcon from "../../assets/bienestar.svg";
import profileIcon from "../../assets/perfil.svg";
import logoutIcon from "../../assets/cerrarSesion.svg";
import contactIcon from "../../assets/cell.svg";
import logo from "../../assets/logo.svg";

const menuItems = [
  { label: "Inicio", path: "/dashboard", icon: homeIcon },
  { label: "Reservas", path: "/reservations", icon: reservationsIcon },
  { label: "Clases grabadas", path: "/recorded-classes", icon: videoIcon },
  { label: "Favoritos", path: "/favorites", icon: favoritesIcon },
  { label: "Perfil", path: "/profile", icon: profileIcon },
  { label: "Contacto", path: "/user/contact", icon: contactIcon },
];

export function DashboardSidebar() {
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
            <p className="text-xs text-[#8B6B52]">Área de usuario</p>
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