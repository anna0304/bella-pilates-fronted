import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";

import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";
import { LoadingPage } from "../../../components/ui/LoadingPage";
import { ErrorState } from "../../../components/ui/ErrorState";

import {
  cancelMyReservation,
  getMyReservations,
} from "../../../services/userReservationsService";

import classImage from "../../../assets/dashboard-hero.jpg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import profileIcon from "../../../assets/perfil.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import policyIcon from "../../../assets/policy.svg";

function getImageUrl(image) {
  if (!image) return classImage;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function getData(response) {
  return response.data || response.reservations || response || [];
}

function formatDate(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "Sin hora";

  return value.slice(0, 5);
}

function getReservationDate(reservation) {
  return (
    reservation.schedule?.date ||
    reservation.date ||
    reservation.reservation_date ||
    reservation.created_at
  );
}

function getReservationStatus(reservation) {
  return reservation.status || "confirmed";
}

function getClassTitle(reservation) {
  return (
    reservation.schedule?.class?.title ||
    reservation.class?.title ||
    reservation.class_name ||
    "Clase"
  );
}

function getInstructorName(reservation) {
  return (
    reservation.schedule?.class?.instructor_name ||
    reservation.class?.instructor_name ||
    reservation.instructor_name ||
    "Instructor por confirmar"
  );
}

function getReservationTime(reservation) {
  const start =
    reservation.schedule?.start_time ||
    reservation.start_time ||
    reservation.time ||
    "";

  const end = reservation.schedule?.end_time || reservation.end_time || "";

  if (start && end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  return formatTime(start);
}

function getStatusLabel(status) {
  const labels = {
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
    no_show: "No asistió",
    pending: "Pendiente",
  };

  return labels[status] || status;
}

function mapReservation(reservation) {
  const status = getReservationStatus(reservation);

  return {
    id: reservation.id,
    title: getClassTitle(reservation),
    date: formatDate(getReservationDate(reservation)),
    time: getReservationTime(reservation),
    location: "Studio Bella Pilates",
    teacher: getInstructorName(reservation),
    status,
    statusLabel: getStatusLabel(status),
    image: getImageUrl(reservation.schedule?.class?.image),
    raw: reservation,
  };
}

function isPastReservation(reservation) {
  const dateValue = getReservationDate(reservation.raw);
  const startTime =
    reservation.raw.schedule?.start_time ||
    reservation.raw.start_time ||
    "00:00";

  const date = new Date(`${dateValue}T${startTime}`);

  if (Number.isNaN(date.getTime())) return false;

  return date < new Date();
}

export function ReservationsPage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [errorReservations, setErrorReservations] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

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
    }, 1800);
  };

  async function loadReservations() {
    try {
      setLoadingReservations(true);
      setErrorReservations(false);

      const response = await getMyReservations();
      const data = getData(response);

      setReservations(data.map(mapReservation));
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setErrorReservations(true);
      showToast("Error al cargar tus reservas");
    } finally {
      setLoadingReservations(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  const groupedReservations = useMemo(() => {
    return {
      upcoming: reservations.filter((reservation) => {
        return (
          reservation.status !== "cancelled" &&
          reservation.status !== "completed" &&
          reservation.status !== "no_show" &&
          !isPastReservation(reservation)
        );
      }),
      past: reservations.filter((reservation) => {
        return (
          reservation.status === "completed" ||
          reservation.status === "no_show" ||
          (reservation.status !== "cancelled" && isPastReservation(reservation))
        );
      }),
      cancelled: reservations.filter((reservation) => {
        return reservation.status === "cancelled";
      }),
    };
  }, [reservations]);

  const activeReservations = groupedReservations[activeTab] || [];

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancellingId(reservationId);

      await cancelMyReservation(reservationId);
      showToast("Reserva cancelada correctamente");
      await loadReservations();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      showToast("Error al cancelar la reserva");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
      <Toast visible={toast.visible} message={toast.message} />

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-[260px] max-w-[85vw]">
            <DashboardSidebar />
          </div>
        </div>
      )}

      <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
        <div className="p-5 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl text-white lg:hidden"
            >
              ☰
            </button>

            <DashboardHeader />
          </div>

          <section>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-[#2F2118]">
                  Mis reservas
                </h1>

                <p className="mt-2 text-[#6F5645]">
                  Aquí puedes ver tus próximas clases y gestionar tus reservas.
                </p>
              </div>

              <Button2
                variant="outline"
                icon={calendarIcon}
                onClick={() => navigate("/reservations/new")}
              >
                Reservar nueva clase
              </Button2>
            </div>

            <div className="mb-6 flex gap-8 overflow-x-auto border-b border-[#E8DDD3]">
              <TabButton
                label="Próximas"
                value="upcoming"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={groupedReservations.upcoming.length}
              />

              <TabButton
                label="Pasadas"
                value="past"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={groupedReservations.past.length}
              />

              <TabButton
                label="Canceladas"
                value="cancelled"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={groupedReservations.cancelled.length}
              />
            </div>

            {loadingReservations ? (
              <LoadingPage text="Cargando tus reservas..." />
            ) : errorReservations ? (
              <ErrorState
                title="No pudimos cargar tus reservas"
                message="Inténtalo de nuevo dentro de unos minutos."
                actionText="Reintentar"
                onAction={loadReservations}
              />
            ) : activeReservations.length === 0 ? (
              <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary px-6 py-12 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-[#2F2118]">
                  No hay reservas para mostrar
                </h2>

                <p className="mt-2 text-sm text-[#6F5645]">
                  Cuando reserves una clase, aparecerá en esta sección.
                </p>

                <Button2
                  variant="outline"
                  icon={calendarIcon}
                  onClick={() => navigate("/reservations/new")}
                  className="mt-6"
                >
                  Reservar clase
                </Button2>
              </div>
            ) : (
              <div className="space-y-5">
                {activeReservations.map((reservation) => (
                  <article
                    key={reservation.id}
                    className="grid gap-4 rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-sm lg:grid-cols-[220px_1fr_auto]"
                  >
                    <img
                      src={reservation.image}
                      alt={reservation.title}
                      className="h-[150px] w-full rounded-[18px] object-cover"
                    />

                    <div>
                      <h2 className="text-2xl font-semibold text-[#2F2118]">
                        {reservation.title}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6F5645]">
                        <InfoItem icon={calendarIcon} text={reservation.date} />
                        <InfoItem icon={clockIcon} text={reservation.time} />
                        <InfoItem
                          icon={locationIcon}
                          text={reservation.location}
                        />
                        <InfoItem
                          icon={profileIcon}
                          text={reservation.teacher}
                        />
                      </div>

                      <span
                        className={`mt-4 inline-flex rounded-full px-4 py-1 text-sm font-medium ${
                          activeTab === "upcoming"
                            ? "bg-[#DDEED2] text-[#4D7C3A]"
                            : activeTab === "past"
                              ? "bg-[#E8E8E8] text-[#4A4A4A]"
                              : "bg-[#FDE4E4] text-[#B54747]"
                        }`}
                      >
                        {reservation.statusLabel}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 lg:justify-center">
                      <Button2
                        variant="outline"
                        onClick={() =>
                          navigate(`/reservations/${reservation.id}`)
                        }
                      >
                        Ver detalles
                      </Button2>

                      {activeTab === "upcoming" && (
                        <Button2
                          variant="outline"
                          disabled={cancellingId === reservation.id}
                          onClick={() =>
                            handleCancelReservation(reservation.id)
                          }
                        >
                          {cancellingId === reservation.id
                            ? "Cancelando..."
                            : "Cancelar reserva"}
                        </Button2>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <img src={policyIcon} alt="" className="mt-1 h-6 w-6" />

                <div>
                  <h3 className="text-lg font-semibold text-[#2F2118]">
                    Política de cancelación
                  </h3>

                  <p className="mt-1 text-sm text-[#6F5645]">
                    Puedes cancelar tu reserva hasta 12 horas antes del inicio
                    de la clase sin penalización.
                  </p>
                </div>
              </div>

              <Button2
                variant="outline"
                onClick={() => navigate("/reservations/policy")}
              >
                Ver política completa
              </Button2>
            </div>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}

function TabButton({ label, value, activeTab, setActiveTab, count }) {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`shrink-0 pb-3 font-semibold transition ${
        isActive ? "border-b-2 border-primary text-primary" : "text-[#6F5645]"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div className="flex min-w-[190px] items-center gap-2">
      <img src={icon} alt="" className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );
}