import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAvailableSchedules } from "../../services/userReservationsService";

import classImage from "../../assets/dashboard-hero.jpg";
import clockIcon from "../../assets/reloj.svg";
import playIcon from "../../assets/video.svg";

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function getData(response) {
  return response.data || response.schedules || response || [];
}

function getImageUrl(image) {
  if (!image) return classImage;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function formatTime(value) {
  if (!value) return "—";
  return value.slice(0, 5);
}

function getScheduleDay(schedule) {
  return schedule?.day_of_week || schedule?.day || "";
}

export function WeeklyClasses() {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedules() {
      try {
        const response = await getAvailableSchedules();
        const data = getData(response);

        setSchedules(data.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar horarios disponibles:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSchedules();
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2F2118]">
          Clases disponibles esta semana
        </h2>

        <button
          type="button"
          onClick={() => navigate("/reservations/new")}
          className="text-sm font-medium text-primary"
        >
          Ver todos los horarios →
        </button>
      </div>

      {loading ? (
        <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary p-8 text-center text-[#6F5645] shadow-sm">
          Cargando horarios disponibles...
        </div>
      ) : schedules.length === 0 ? (
        <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary p-8 text-center text-[#6F5645] shadow-sm">
          No hay horarios disponibles por ahora.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {schedules.map((item) => (
            <article
              key={item.id}
              className="rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-sm"
            >
              <div className="relative overflow-hidden rounded-[18px]">
                <img
                  src={getImageUrl(item.class?.image)}
                  alt={item.class?.title || "Clase"}
                  className="h-[160px] w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
                    <img src={playIcon} alt="" className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-[#2F2118]">
                  {item.class?.title || "Clase"}
                </h3>

                <p className="mt-2 text-sm text-[#6F5645]">
                  {dayLabels[getScheduleDay(item)] || getScheduleDay(item)}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-[#6F5645]">
                  <img src={clockIcon} alt="" className="h-4 w-4" />
                  <span>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-[#4D7C3A]">
                  Disponible
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/reservations/new")}
                  className="mt-4 w-full rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Reservar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}