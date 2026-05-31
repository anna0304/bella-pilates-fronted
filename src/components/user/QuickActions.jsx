import calendarIcon from "../../assets/horarios.svg";
import videoIcon from "../../assets/video.svg";
import heartIcon from "../../assets/bienestar.svg";

export function QuickActions() {
  return (
    <section className="mt-6">
      <h2 className="mb-5 text-2xl font-semibold text-[#2F2118]">
        ¿Qué quieres hacer hoy?
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="flex min-h-[280px] flex-col items-center rounded-[24px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE1D4]">
            <img src={calendarIcon} alt="" className="h-9 w-9" />
          </div>

          <h3 className="mt-7 text-2xl font-semibold text-[#2F2118]">
            Reservar clase
          </h3>

          <p className="mt-4 max-w-[230px] text-base leading-relaxed text-[#6F5645]">
            Consulta los horarios disponibles y reserva tu próxima clase.
          </p>

          <button className="mt-auto rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90">
            Ver horarios →
          </button>
        </article>

        <article className="flex min-h-[280px] flex-col items-center rounded-[24px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE1D4]">
            <img src={videoIcon} alt="" className="h-9 w-9" />
          </div>

          <h3 className="mt-7 text-2xl font-semibold text-[#2F2118]">
            Clases grabadas
          </h3>

          <p className="mt-4 max-w-[230px] text-base leading-relaxed text-[#6F5645]">
            Accede a todas las clases grabadas y entrena desde casa.
          </p>

          <button className="mt-auto rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90">
            Ver clases →
          </button>
        </article>

        <article className="flex min-h-[280px] flex-col items-center rounded-[24px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE1D4]">
            <img src={heartIcon} alt="" className="h-9 w-9" />
          </div>

          <h3 className="mt-7 text-2xl font-semibold text-[#2F2118]">
            Mis favoritos
          </h3>

          <p className="mt-4 max-w-[230px] text-base leading-relaxed text-[#6F5645]">
            Encuentra aquí las clases que guardaste como favoritas.
          </p>

          <button className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90">
            Ver favoritos →
          </button>
        </article>
      </div>
    </section>
  );
}