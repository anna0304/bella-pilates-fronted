import clockIcon from "../../../assets/reloj.svg";
import profileIcon from "../../../assets/perfil.svg";
import policyIcon from "../../../assets/policy.svg";
import videoIcon from "../../../assets/video.svg";

export function ViewClassModal({ classItem, onClose, onEdit }) {
  if (!classItem) return null;

  const isActive = classItem.status === "Activa";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Detalle de clase
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Información general de la clase.
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

        <img
          src={classItem.image}
          alt={classItem.name}
          className="h-[220px] w-full rounded-[24px] object-cover md:h-[260px]"
        />

        <div className="my-6 border-t border-[#E8DDD3]" />

        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-[#2F2118]">
                {classItem.name}
              </h3>

              <p className="mt-3 max-w-xl leading-relaxed text-[#6F5645]">
                {classItem.description || "Sin descripción."}
              </p>
            </div>

            <span
              className={`w-fit shrink-0 rounded-full px-4 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-[#E8F6EC] text-[#1F8A4C]"
                  : "bg-[#FDECEC] text-[#D64545]"
              }`}
            >
              {classItem.status}
            </span>
          </div>
        </section>

        <div className="my-6 border-t border-[#E8DDD3]" />

        <section>
          <h3 className="text-lg font-semibold text-primary">
            Información general
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoItem
              icon={videoIcon}
              label="Categoría"
              value={classItem.category}
            />

            <InfoItem
              icon={profileIcon}
              label="Instructor"
              value={classItem.instructor}
            />

            <InfoItem
              icon={policyIcon}
              label="Nivel"
              value={classItem.level}
            />

            <InfoItem
              icon={clockIcon}
              label="Duración"
              value={classItem.duration}
            />
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
            onClick={() => onEdit(classItem)}
            className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
          >
            Editar clase
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