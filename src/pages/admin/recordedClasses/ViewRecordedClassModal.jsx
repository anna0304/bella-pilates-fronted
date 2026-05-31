import eyeIcon from "../../../assets/ojo.svg";
import clockIcon from "../../../assets/reloj.svg";
import profileIcon from "../../../assets/perfil.svg";
import videoIcon from "../../../assets/video.svg";
import policyIcon from "../../../assets/policy.svg";

export function ViewRecordedClassModal({ video, onClose, onEdit }) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Detalle de clase grabada
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Información del contenido publicado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-[300px] w-full rounded-[24px] object-cover"
        />

        <div className="mt-6">
          <h3 className="text-3xl font-semibold text-[#2F2118]">
            {video.title}
          </h3>

          <p className="mt-3 leading-relaxed text-[#6F5645]">
            {video.description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoItem icon={videoIcon} label="Categoría" value={video.category} />
          <InfoItem icon={profileIcon} label="Instructor" value={video.instructor} />
          <InfoItem icon={policyIcon} label="Nivel" value={video.level} />
          <InfoItem icon={clockIcon} label="Duración" value={video.duration} />
          <InfoItem icon={eyeIcon} label="Visualizaciones" value={video.views} />
          <InfoItem icon={policyIcon} label="Estado" value={video.status} />
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => onEdit(video)}
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
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5DD]">
        <img src={icon} alt="" className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
        <p className="mt-1 font-semibold text-[#2F2118]">{value || "—"}</p>
      </div>
    </div>
  );
}