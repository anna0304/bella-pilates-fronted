import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecordedClasses } from "../../services/userRecordedClassesService";

import videoImage from "../../assets/dashboard-hero.jpg";
import playIcon from "../../assets/video.svg";
import lockIcon from "../../assets/candado.svg";

function getData(response) {
  return response.data || response.recordedClasses || response || [];
}

function getImageUrl(image) {
  if (!image) return videoImage;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function formatDuration(duration) {
  if (!duration) return "—";

  const minutes = Number(duration);

  if (Number.isNaN(minutes)) {
    return duration;
  }

  return `${minutes} min`;
}

function formatLevel(level) {
  const levels = {
    beginner: "Nivel Principiante",
    intermediate: "Nivel Intermedio",
    advanced: "Nivel Avanzado",
  };

  return levels[level] || level || "Nivel no definido";
}

export function RecommendedRecordedClasses() {
  const navigate = useNavigate();

  const [recordedClasses, setRecordedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecordedClasses() {
      try {
        const response = await getRecordedClasses();
        const data = getData(response);

        setRecordedClasses(data.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar clases grabadas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecordedClasses();
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2F2118]">
          Clases grabadas recomendadas
        </h2>

        <button
          type="button"
          onClick={() => navigate("/recorded-classes")}
          className="text-sm font-medium text-primary"
        >
          Ver todas →
        </button>
      </div>

      {loading ? (
        <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary p-8 text-center text-[#6F5645] shadow-sm">
          Cargando clases grabadas...
        </div>
      ) : recordedClasses.length === 0 ? (
        <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary p-8 text-center text-[#6F5645] shadow-sm">
          No hay clases grabadas disponibles.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {recordedClasses.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/recorded-classes/${item.id}`)}
              className="cursor-pointer rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="relative overflow-hidden rounded-[18px]">
                <img
                  src={getImageUrl(item.thumbnail || item.class?.image)}
                  alt={item.title}
                  className="h-[160px] w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
                    <img src={playIcon} alt="" className="h-4 w-4" />
                  </span>
                </div>

                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                  {formatDuration(item.duration)}
                </span>
              </div>

              <div className="pt-4">
                <h3 className="text-base font-semibold leading-snug text-[#2F2118]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-primary">
                  {formatLevel(item.level)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40">
            <img src={lockIcon} alt="" className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-[#2F2118]">
              Seguridad de tu cuenta
            </h3>
            <p className="text-sm text-[#6F5645]">
              Cambia tu contraseña periódicamente.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full border border-primary px-7 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          onClick={() => navigate("/profile#security")}
        >
          Cambiar contraseña →
        </button>
      </div>
    </section>
  );
}