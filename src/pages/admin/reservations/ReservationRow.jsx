import { useEffect, useRef, useState } from "react";

import profileIcon from "../../../assets/perfil.svg";
import eyeIcon from "../../../assets/ojo.svg";

const statusOptions = ["Confirmada", "Cancelada", "Completada", "No asistió"];

export function ReservationRow({ reservation, onView, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleScroll() {
      setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const toggleMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 230;
    const shouldOpenUp = rect.bottom + menuHeight > window.innerHeight;

    setMenuPosition({
      top: shouldOpenUp ? rect.top - menuHeight - 8 : rect.bottom + 8,
      left: rect.right - 220,
    });

    setIsMenuOpen((current) => !current);
  };

  const handleStatusChange = (status) => {
    onChangeStatus(reservation.id, status);
    setIsMenuOpen(false);
  };

  return (
    <tr className="text-sm text-[#2F2118] transition hover:bg-[#FCF8F5]">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
            <img src={profileIcon} alt="" className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="break-words font-semibold">{reservation.userName}</p>
            <p className="break-words text-xs text-[#6F5645]">
              {reservation.userEmail}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="font-medium">{reservation.className}</p>
        <LevelBadge level={reservation.level} />
      </td>

      <td className="px-4 py-4 text-[#6F5645]">{reservation.instructor}</td>

      <td className="px-4 py-4">
        <p className="font-medium">{reservation.date}</p>
        <p className="text-xs text-[#6F5645]">{reservation.day}</p>
      </td>

      <td className="px-4 py-4">
        <p className="font-medium">{reservation.time}</p>
        <p className="text-xs text-[#6F5645]">{reservation.duration}</p>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={reservation.status} />
      </td>

      <td className="px-4 py-4">
        <p className="font-medium">{reservation.reservationDate}</p>
        <p className="text-xs text-[#6F5645]">
          {reservation.reservationTime}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={eyeIcon} alt="Ver reserva" className="h-5 w-5" />
          </button>

          <button
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] text-xl text-primary transition hover:border-primary"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
              className="fixed z-[99999] w-[220px] rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl"
            >
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className="w-full rounded-[12px] px-4 py-3 text-left text-sm font-medium text-[#2F2118] transition hover:bg-[#FCF8F5]"
                >
                  Marcar como {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    Confirmada: "bg-[#E8F6EC] text-[#1F8A4C]",
    Cancelada: "bg-[#FDECEC] text-[#D64545]",
    Completada: "bg-[#E8F0FE] text-[#2D5BBF]",
    "No asistió": "bg-[#EFEFEF] text-[#666666]",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${
        styles[status] || "bg-[#EFEFEF] text-[#666666]"
      }`}
    >
      {status}
    </span>
  );
}

export function LevelBadge({ level }) {
  const styles = {
    "Nivel Principiante": "bg-[#E8F6EC] text-[#1F8A4C]",
    "Nivel Intermedio": "bg-[#F1E5F8] text-[#7A3FA0]",
    "Nivel Avanzado": "bg-[#E8F0FE] text-[#2D5BBF]",
  };

  return (
    <span
      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[level] || "bg-[#F8EADF] text-primary"
      }`}
    >
      {level}
    </span>
  );
}