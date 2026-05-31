import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import profileIcon from "../../../assets/perfil.svg";
import policyIcon from "../../../assets/policy.svg";

export function ViewReservationModal({ reservation, onClose }) {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Detalle de reserva
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Información completa de la reserva.
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

        <div className="rounded-[22px] bg-[#FCF8F5] p-6">
          <h3 className="text-3xl font-semibold text-[#2F2118]">
            {reservation.className}
          </h3>

          <p className="mt-2 text-[#6F5645]">
            Reserva de {reservation.userName}
          </p>
        </div>

        <div className="my-6 border-t border-[#E8DDD3]" />

        <section>
          <h3 className="text-lg font-semibold text-primary">
            Información general
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoItem
              icon={profileIcon}
              label="Usuario"
              value={reservation.userName}
            />

            <InfoItem
              icon={policyIcon}
              label="Email"
              value={reservation.userEmail}
            />

            <InfoItem
              icon={calendarIcon}
              label="Fecha"
              value={`${reservation.date} · ${reservation.day}`}
            />

            <InfoItem
              icon={clockIcon}
              label="Hora"
              value={`${reservation.time} · ${reservation.duration}`}
            />

            <InfoItem
              icon={profileIcon}
              label="Instructor"
              value={reservation.instructor}
            />

            <InfoItem
              icon={policyIcon}
              label="Nivel"
              value={reservation.level}
            />

            <InfoItem
              icon={calendarIcon}
              label="Fecha de reserva"
              value={`${reservation.reservationDate} · ${reservation.reservationTime}`}
            />

            <InfoItem
              icon={policyIcon}
              label="Estado"
              value={reservation.status}
            />
          </div>
        </section>

        {reservation.notes && (
          <>
            <div className="my-6 border-t border-[#E8DDD3]" />

            <section>
              <h3 className="text-lg font-semibold text-primary">Notas</h3>

              <div className="mt-4 rounded-[18px] border border-[#E8DDD3] bg-white p-5">
                <p className="text-[#2F2118]">{reservation.notes}</p>
              </div>
            </section>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-[#E8DDD3] pt-6 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
          >
            Cerrar
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