import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NotificationsDropdown } from "./NotificationsDropdown";

import logoutIcon from "../../assets/cerrarSesion.svg";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();

  const user = useMemo(() => {
    const savedUser = localStorage.getItem("bella_pilates_user");
    return savedUser ? JSON.parse(savedUser) : null;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-end">
      <div className="flex items-center gap-4">
        <NotificationsDropdown />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex items-center gap-3 rounded-[16px] px-2 py-1 transition hover:bg-[#EFE5DD]"
          >
            <div className="h-12 w-12 rounded-full bg-[#D9C4B2]" />

            <span className="font-medium text-[#2F2118]">
              Hola, {user?.name ?? "Usuario"}
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-16 z-50 w-[220px] rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-[12px] px-4 py-3 text-left text-sm font-medium text-[#5A4030] transition hover:bg-[#FCF8F5]"
              >
                <img src={logoutIcon} alt="" className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
