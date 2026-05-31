import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyReservations } from "../../services/userReservationsService";

import classImage from "../../assets/dashboard-hero.jpg";
import calendarIcon from "../../assets/horarios.svg";
import clockIcon from "../../assets/reloj.svg";
import profileIcon from "../../assets/perfil.svg";

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
  return response.data || response.reservations || response || [];
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

export function UpcomingClassCard() {
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservation() {
      try {
        const response = await getMyReservations();
        const data = getData(response);

        const confirmedReservations = data.filter(
          (item) => item.status === "confirmed",
        );

        setReservation(confirmedReservations[0] || null);
      } catch (error) {
        console.error("Error al cargar próxima reserva:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReservation();
  }, []);

  if (loading) {
    return (
      <section className="mt-6 rounded-[28px] border border-[#E8DDD3] bg-secondary p-6 text-center text-[#6F5645] shadow-sm">
        Cargando próxima clase...
      </section>
    );
  }

  if (!reservation) {
    return (
      <section className="mt-6 rounded-[28px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <img src={calendarIcon} alt="" className="h-5 w-5" />

          <h2 className="text-xl font-semibold text-[#2F2118]">
            Tu próxima clase
          </h2>
        </div>

        <div className="rounded-[22px] bg-[#FCF8F5] p-8 text-center">
          <h3 className="text-xl font-semibold text-[#2F2118]">
            No tienes reservas activas
          </h3>

          <p className="mt-2 text-[#6F5645]">
            Reserva una clase para verla aquí.
          </p>

          <button
            type="button"
            onClick={() => navigate("/reservations/new")}
            className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Reservar clase
          </button>
        </div>
      </section>
    );
  }

  const schedule = reservation.schedule;
  const classData = schedule?.class;

  return (
    <section className="mt-6 rounded-[28px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <img src={calendarIcon} alt="" className="h-5 w-5" />

        <h2 className="text-xl font-semibold text-[#2F2118]">
          Tu próxima clase
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr_auto] lg:items-center">
        <img
          src={getImageUrl(classData?.image)}
          alt={classData?.title || "Clase de pilates"}
          className="h-[170px] w-full rounded-[20px] object-cover"
        />

        <div>
          <h3 className="text-2xl font-semibold text-[#2F2118]">
            {classData?.title || "Clase"}
          </h3>

          <div className="mt-5 space-y-3 text-[#6F5645]">
            <div className="flex items-center gap-3">
              <img src={calendarIcon} alt="" className="h-5 w-5" />
              <p>
                {dayLabels[getScheduleDay(schedule)] || getScheduleDay(schedule)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img src={clockIcon} alt="" className="h-5 w-5" />
              <p>
                {formatTime(schedule?.start_time)} -{" "}
                {formatTime(schedule?.end_time)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img src={profileIcon} alt="" className="h-5 w-5" />
              <p>{classData?.instructor_name || "Instructor por confirmar"}</p>
            </div>
          </div>

          <span className="mt-4 inline-flex rounded-full bg-[#DDEED2] px-4 py-1 text-sm font-medium text-[#4D7C3A]">
            Reservada
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/reservations/${reservation.id}`)}
          className="rounded-full bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90"
        >
          Ver detalles →
        </button>
      </div>
    </section>
  );
}