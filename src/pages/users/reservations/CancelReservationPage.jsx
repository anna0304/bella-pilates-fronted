import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";

import {
  cancelMyReservation,
  getMyReservations,
} from "../../../services/userReservationsService";

import classImage from "../../../assets/dashboard-hero.jpg";
import warningIcon from "../../../assets/warning.svg";
import policyIcon from "../../../assets/policy.svg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import profileIcon from "../../../assets/perfil.svg";

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

export function CancelReservationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reason, setReason] = useState("");
  const [reservation, setReservation] = useState(null);
  const [loadingReservation, setLoadingReservation] = useState(true);
  const [cancellingReservation, setCancellingReservation] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({
      visible: true,
      message,
    });

    setTimeout(() => {
      setToast({
        visible: false,
        message: "",
      });
    }, 2000);
  };

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
        console.error("Error al cargar reserva:", error);
        setReservation(null);
      } finally {
        setLoadingReservation(false);
      }
    }

    loadReservation();
  }, [id]);

  const handleCancelReservation = async () => {
    try {
      setCancellingReservation(true);

      await cancelMyReservation(id);

      if (reservation) {
        localStorage.setItem(
          "bella_pilates_cancelled_reservation",
          JSON.stringify({
            ...reservation,
            cancel_reason: reason,
            status: "cancelled",
          }),
        );
      }

      navigate(`/reservations/${id}/cancelled`);
    } catch (error) {
      console.error("Error al cancelar reserva:", error);

      const message =
        error?.response?.data?.message ||
        "No se pudo cancelar la reserva. Inténtalo de nuevo.";

      showToast(message);
    } finally {
      setCancellingReservation(false);
    }
  };

  if (loadingReservation) {
    return (
      <div className="min-h-screen bg-[#F8F3EE]">
        <Toast visible={toast.visible} message={toast.message} />

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
        <Toast visible={toast.visible} message={toast.message} />

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
      <Toast visible={toast.visible} message={toast.message} />

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[900px] p-5 lg:p-10">
          <button
            onClick={() => navigate(`/reservations/${id}`)}
            className="mb-8 font-semibold text-primary"
          >
            ← Volver
          </button>

          <h1 className="text-5xl font-semibold text-[#2F2118]">
            Cancelar reserva
          </h1>

          <div className="mt-16 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#F8E9DF]">
              <img src={warningIcon} alt="" className="h-16 w-16" />
            </div>

            <h2 className="mt-8 text-3xl font-semibold text-[#2F2118]">
              ¿Estás segura de cancelar tu reserva?
            </h2>

            <p className="mt-3 text-2xl text-[#6F5645]">
              Tu lugar será liberado para otra persona.
            </p>
          </div>

          <section className="mt-12 rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-[#2F2118]">
              Reserva que vas a cancelar
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

          <div className="mt-10">
            <label className="mb-3 block text-lg font-medium text-[#2F2118]">
              Cuéntanos el motivo (opcional)
            </label>

            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-[18px] border border-[#E8DDD3] bg-secondary px-5 py-5 text-lg outline-none focus:border-primary"
            >
              <option value="">Selecciona una opción</option>
              <option value="schedule">No puedo asistir por horario</option>
              <option value="health">Motivos de salud</option>
              <option value="other">Otro motivo</option>
            </select>
          </div>

          <div className="mt-12 space-y-5">
            <Button2
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/reservations/${id}`)}
            >
              No, volver
            </Button2>

            <button
              type="button"
              disabled={cancellingReservation}
              onClick={handleCancelReservation}
              className="w-full rounded-[18px] bg-red-600 px-6 py-5 text-lg font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancellingReservation
                ? "Cancelando reserva..."
                : "Sí, cancelar reserva"}
            </button>
          </div>

          <section className="mt-16 flex items-center gap-4 rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
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

function IconText({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt="" className="h-5 w-5" />
      <span>{text}</span>
    </div>
  );
}