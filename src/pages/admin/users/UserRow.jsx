import { useEffect, useRef, useState } from "react";

import profileIcon from "../../../assets/perfil.svg";
import eyeIcon from "../../../assets/ojo.svg";
import editIcon from "../../../assets/lapiz.svg";

export function UserRow({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = user.status === "Activo";
  const isAdmin = user.role === "Administrador";

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


  const handleResetPassword = () => {
    onResetPassword(user);
    setIsMenuOpen(false);
  };

  return (
    <tr className="text-sm text-[#2F2118] transition hover:bg-[#FCF8F5]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5DD]">
            <img src={profileIcon} alt="" className="h-5 w-5" />
          </div>

          <span className="font-medium">{user.name}</span>
        </div>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">{user.email}</td>

      <td className="px-5 py-4">
        <span
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            isAdmin
              ? "bg-[#F1E5F8] text-[#7A3FA0]"
              : "bg-[#F8EADF] text-primary"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleStatus}
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            isActive
              ? "bg-[#E8F6EC] text-[#1F8A4C]"
              : "bg-[#FDECEC] text-[#D64545]"
          }`}
        >
          {user.status}
        </button>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">{user.registerDate}</td>


      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={eyeIcon} alt="Ver usuario" className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={editIcon} alt="Editar usuario" className="h-5 w-5" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] text-xl text-primary transition hover:border-primary"
            >
              ⋮
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-[220px] rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full rounded-[12px] px-4 py-3 text-left text-sm font-medium text-[#2F2118] transition hover:bg-[#FCF8F5]"
                >
                  Resetear contraseña
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
