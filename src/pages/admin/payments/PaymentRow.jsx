import { useEffect, useRef, useState } from "react";

import profileIcon from "../../../assets/perfil.svg";
import eyeIcon from "../../../assets/ojo.svg";

const statusOptions = ["Completado", "Pendiente", "Fallido", "Reembolsado"];

export function PaymentRow({ payment, onView, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const handleStatusChange = (status) => {
    onChangeStatus(payment.id, status);
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
            <p className="break-words font-semibold">{payment.userName}</p>
            <p className="break-words text-xs text-[#6F5645]">
              {payment.userEmail}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="break-words font-medium">{payment.concept}</p>
        <p className="break-words text-xs text-[#6F5645]">{payment.detail}</p>
      </td>

      <td className="px-4 py-4 font-semibold">{payment.amount}</td>

      <td className="px-4 py-4">
        <StatusBadge status={payment.status} />
      </td>

      <td className="px-4 py-4 text-[#6F5645]">{payment.method}</td>

      <td className="px-4 py-4">
        <p>{payment.date}</p>
        <p className="text-xs text-[#6F5645]">{payment.time}</p>
      </td>

      <td className="px-4 py-4 font-semibold text-primary">
        {payment.invoice}
      </td>

      <td className="w-[140px] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={eyeIcon} alt="Ver pago" className="h-5 w-5" />
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
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completado: "bg-[#E8F6EC] text-[#1F8A4C]",
    Pendiente: "bg-[#FFF1D8] text-[#D98300]",
    Fallido: "bg-[#FDECEC] text-[#D64545]",
    Reembolsado: "bg-[#EFEFEF] text-[#666666]",
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