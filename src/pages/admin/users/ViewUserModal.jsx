import profileIcon from "../../../assets/perfil.svg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import policyIcon from "../../../assets/policy.svg";
import favoriteIcon from "../../../assets/bienestar.svg";

export function ViewUserModal({ user, onClose, onEdit }) {
  if (!user) return null;

  const isActive = user.status === "Activo";
  const isAdmin = user.role === "Administrador";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Detalle del usuario
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Información general de la cuenta.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-6 rounded-[22px] bg-[#FCF8F5] p-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
            <img src={profileIcon} alt="" className="h-10 w-10" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="break-words text-2xl font-semibold text-[#2F2118]">
              {user.name}
            </h3>

            <p className="mt-1 break-words text-[#6F5645]">{user.email}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${
                  isAdmin
                    ? "bg-[#F1E5F8] text-[#7A3FA0]"
                    : "bg-[#F8EADF] text-primary"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-[#E8F6EC] text-[#1F8A4C]"
                    : "bg-[#FDECEC] text-[#D64545]"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-[#E8DDD3]" />

        <section>
          <h3 className="text-lg font-semibold text-primary">
            Información general
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoItem label="Teléfono" value={user.phone} icon={profileIcon} />
            <InfoItem label="Fecha de registro" value={user.registerDate} icon={calendarIcon} />
            <InfoItem label="Plan actual" value={user.plan} icon={policyIcon} />
            <InfoItem label="Reservas realizadas" value={user.reservations} icon={calendarIcon} />
            <InfoItem label="Clases favoritas" value={user.favorites} icon={favoriteIcon} />
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#E8DDD3] pt-6 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => onEdit(user)}
            className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
          >
            Editar usuario
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-[#E8DDD3] bg-white p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
        <img src={icon} alt="" className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
        <p className="mt-1 break-words font-semibold text-[#2F2118]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}