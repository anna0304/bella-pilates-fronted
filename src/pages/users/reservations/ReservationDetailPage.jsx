import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";

import { getMyReservations } from "../../../services/userReservationsService";

import classImage from "../../../assets/dashboard-hero.jpg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import profileIcon from "../../../assets/perfil.svg";
import policyIcon from "../../../assets/policy.svg";

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function getImageUrl(image) {
  if (!image) return classImage;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function getData(response) {
  return response.data || response.reservations || response || [];
}

function formatTime(value) {
  if (!value) return "—";
  return value.slice(0, 5);
}

function formatLevel(level) {
  const levels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return levels[level] || level || "Todos los niveles";
}

function getScheduleDay(schedule) {
  return schedule?.day_of_week || schedule?.day || "";
}

function getStatusLabel(status) {
  const labels = {
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
    no_show: "No asistió",
    pending: "Pendiente",
  };

  return labels[status] || status || "—";
}

function getStatusStyles(status) {
  const styles = {
    confirmed: "bg-[#DDEED2] text-[#4D7C3A]",
    cancelled: "bg-[#FDE4E4] text-[#B54747]",
    completed: "bg-[#E8E8E8] text-[#4A4A4A]",
    no_show: "bg-[#FDE4E4] text-[#B54747]",
    pending: "bg-[#FFF1D8] text-[#D98300]",
  };

  return styles[status] || "bg-[#E8E8E8] text-[#4A4A4A]";
}

export function ReservationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loadingReservation, setLoadingReservation] = useState(true);

  useEffect(() => {
    async function loadReservation() {
      try {
        const response = await getMyReservations();
        const data = getData(response);

        const foundReservation = data.find(
          (item) => String(item.id) === String(id),
        );

        setReservation(foundReservation || null);
      } catch (error) {
        console.error("Error al cargar detalle de reserva:", error);
        setReservation(null);
      } finally {
        setLoadingReservation(false);
      }
    }

    loadReservation();
  }, [id]);

  if (loadingReservation) {
    return (
      <div className="min-h-screen bg-[#F8F3EE]">
        <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
          <DashboardSidebar />
        </div>

        <main className="min-h-screen lg:ml-[260px]">
          <div className="mx-auto max-w-[900px] p-5 lg:p-10">
            <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
              <p className="text-[#6F5645]">Cargando reserva...</p>
            </section>
          </div>

          <DashboardFooter />
        </main>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#F8F3EE]">
        <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
          <DashboardSidebar />
        </div>

        <main className="min-h-screen lg:ml-[260px]">
          <div className="mx-auto max-w-[900px] p-5 lg:p-10">
            <button
              onClick={() => navigate("/reservations")}
              className="mb-8 font-semibold text-primary"
            >
              ← Volver
            </button>

            <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
              <h1 className="text-3xl font-semibold text-[#2F2118]">
                Reserva no encontrada
              </h1>

              <p className="mt-3 text-[#6F5645]">
                No hemos podido encontrar esta reserva.
              </p>
            </section>
          </div>

          <DashboardFooter />
        </main>
      </div>
    );
  }

  const schedule = reservation.schedule;
  const classData = schedule?.class;
  const status = reservation.status;

  const title = classData?.title || "Clase";
  const day = dayLabels[getScheduleDay(schedule)] || getScheduleDay(schedule);
  const time = `${formatTime(schedule?.start_time)} - ${formatTime(
    schedule?.end_time,
  )}`;
  const teacher = classData?.instructor_name || "Instructor por confirmar";
  const level = `${formatLevel(classData?.level)} • Duración: ${
    classData?.duration || "—"
  } min`;
  const image = getImageUrl(classData?.image);

  return (
    <div className="min-h-screen bg-[#F8F3EE]">
      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[900px] p-5 lg:p-10">
          <button
            onClick={() => navigate("/reservations")}
            className="mb-8 font-semibold text-primary"
          >
            ← Volver
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-semibold text-[#2F2118]">
              Detalle de reserva
            </h1>

            <span
              className={`rounded-full px-4 py-2 font-semibold ${getStatusStyles(
                status,
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          <img
            src={image}
            alt={title}
            className="mt-8 h-[360px] w-full rounded-[28px] object-cover"
          />

          <section className="mt-8">
            <h2 className="text-3xl font-semibold text-[#2F2118]">{title}</h2>

            <div className="mt-8 space-y-6 text-[#2F2118]">
              <InfoRow icon={calendarIcon} label="Día" value={day} />
              <InfoRow icon={clockIcon} label="Hora" value={time} />
              <InfoRow
                icon={locationIcon}
                label="Lugar"
                value="Studio Bella Pilates"
              />
              <InfoRow icon={profileIcon} label="Profesor/a" value={teacher} />
              <InfoRow icon={policyIcon} label="Nivel" value={level} />
            </div>
          </section>

          <section className="mt-10 rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-[#2F2118]">
              Resumen de la reserva
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
              <img
                src={image}
                alt={title}
                className="h-[200px] w-full rounded-[22px] object-cover"
              />

              <div>
                <h4 className="text-2xl font-semibold text-[#2F2118]">
                  {title}
                </h4>

                <span
                  className={`mt-3 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${getStatusStyles(
                    status,
                  )}`}
                >
                  {getStatusLabel(status)}
                </span>

                <div className="mt-5 space-y-3 text-[#2F2118]">
                  <IconText icon={calendarIcon} text={day} />
                  <IconText icon={clockIcon} text={time} />
                  <IconText icon={locationIcon} text="Studio Bella Pilates" />
                  <IconText icon={profileIcon} text={teacher} />
                  <IconText icon={policyIcon} text={`Nivel: ${level}`} />
                </div>
              </div>
            </div>
          </section>

          {status === "confirmed" && (
            <section className="mt-8 rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-[#2F2118]">
                Política de cancelación
              </h3>

              <p className="mt-4 text-[#6F5645]">
                Puedes cancelar tu reserva hasta 12 horas antes del inicio de la
                clase sin penalización.
              </p>

              <Button2
                variant="outline"
                className="mt-8 border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => navigate(`/reservations/${id}/cancel`)}
              >
                Cancelar reserva
              </Button2>
            </section>
          )}

          <section className="mt-8 flex items-center gap-4 rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
            <img src={policyIcon} alt="" className="h-10 w-10" />
            <div>
              <h3 className="font-semibold text-[#2F2118]">
                Tu información está segura con nosotros.
              </h3>
              <p className="text-[#6F5645]">
                La usamos únicamente para tu reserva.
              </p>
            </div>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="grid grid-cols-[32px_90px_1fr] items-center gap-4">
      <img src={icon} alt="" className="h-6 w-6" />
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function IconText({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt="" className="h-5 w-5" />
      <span>{text}</span>
    </div>
  );
}