import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";

import { createMyReservation } from "../../../services/userReservationsService";

import classImage from "../../../assets/dashboard-hero.jpg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import locationIcon from "../../../assets/ubicacion.svg";

function getImageUrl(image) {
  if (!image) return classImage;

  if (image.startsWith("http")) {
    return image;
  }

  return `http://localhost:8000/storage/${image}`;
}

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function formatLevel(level) {
  const levels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return levels[level] || level || "Todos los niveles";
}

function formatTime(value) {
  if (!value) return "—";
  return value.slice(0, 5);
}

function getScheduleDay(schedule) {
  return schedule?.day_of_week || schedule?.day || "";
}

export function ConfirmReservationPage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [notes, setNotes] = useState("");
  const [creatingReservation, setCreatingReservation] = useState(false);
  const [reservationCreated, setReservationCreated] = useState(false);

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
    const storedClass = localStorage.getItem("bella_pilates_reservation_class");
    const storedSchedule = localStorage.getItem(
      "bella_pilates_reservation_schedule",
    );
    const storedNotes = localStorage.getItem("bella_pilates_reservation_notes");

    if (!storedClass || !storedSchedule) {
      navigate("/reservations/new", { replace: true });
      return;
    }

    try {
      setSelectedClass(JSON.parse(storedClass));
      setSelectedSchedule(JSON.parse(storedSchedule));
      setNotes(storedNotes || "");
    } catch (error) {
      console.error("Error al leer la reserva temporal:", error);
      navigate("/reservations/new", { replace: true });
    }
  }, [navigate]);

  const handleCreateReservation = async () => {
    if (!selectedSchedule?.id) {
      showToast("No se encontró el horario seleccionado");
      return;
    }

    try {
      setCreatingReservation(true);

      await createMyReservation({
        schedule_id: selectedSchedule.id,
        notes: notes || null,
      });

      localStorage.removeItem("bella_pilates_reservation_class");
      localStorage.removeItem("bella_pilates_reservation_schedule");
      localStorage.removeItem("bella_pilates_reservation_notes");

      setReservationCreated(true);
      showToast("Reserva creada correctamente");
    } catch (error) {
      console.error("Error al crear reserva:", error);

      const message =
        error?.response?.data?.message ||
        "No se pudo crear la reserva. Inténtalo de nuevo.";

      showToast(message);
    } finally {
      setCreatingReservation(false);
    }
  };

  if (!selectedClass || !selectedSchedule) {
    return null;
  }

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

          <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm lg:p-10">
            <h1 className="text-4xl font-semibold text-[#2F2118]">
              Reservar clase
            </h1>

            <p className="mt-3 text-[#6F5645]">
              Revisa el resumen y confirma tu reserva.
            </p>

            <div className="my-10 flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-1 items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${
                      step === 4
                        ? "bg-primary text-white"
                        : "bg-[#EFE5DD] text-[#2F2118]"
                    }`}
                  >
                    {step}
                  </div>

                  {step !== 4 && (
                    <div className="h-[2px] flex-1 bg-[#E8DDD3]" />
                  )}
                </div>
              ))}
            </div>

            <div className="mx-auto max-w-[720px] text-center">
              <div
                className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full text-6xl text-white ${
                  reservationCreated ? "bg-[#3F7A35]" : "bg-primary"
                }`}
              >
                {reservationCreated ? "✓" : "4"}
              </div>

              <h2
                className={`mt-8 text-4xl font-semibold ${
                  reservationCreated ? "text-[#3F7A35]" : "text-[#2F2118]"
                }`}
              >
                {reservationCreated
                  ? "¡Reserva confirmada!"
                  : "Confirma tu reserva"}
              </h2>

              <p className="mt-5 text-xl text-[#2F2118]">
                {reservationCreated
                  ? "Tu lugar está asegurado."
                  : "Cuando confirmes, tu reserva se guardará en el sistema."}
              </p>

              <div className="mt-10 rounded-[24px] border border-[#E8DDD3] bg-secondary p-8 text-left shadow-sm">
                <h3 className="text-2xl font-semibold text-[#2F2118]">
                  Resumen de tu reserva
                </h3>

                <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                  <img
                    src={getImageUrl(selectedClass.image)}
                    alt={selectedClass.title}
                    className="h-[150px] w-full rounded-[18px] object-cover"
                  />

                  <div>
                    <h4 className="text-2xl font-semibold text-[#2F2118]">
                      {selectedClass.title}
                    </h4>

                    <p className="mt-2 text-xl text-[#2F2118]">
                      {formatLevel(selectedClass.level)}
                      <span className="mx-3">•</span>
                      {selectedClass.duration} min
                    </p>

                    <div className="mt-6 space-y-4 text-xl text-[#2F2118]">
                      <IconText
                        icon={calendarIcon}
                        text={
                          dayLabels[getScheduleDay(selectedSchedule)] ||
                          getScheduleDay(selectedSchedule)
                        }
                      />

                      <IconText
                        icon={clockIcon}
                        text={`${formatTime(
                          selectedSchedule.start_time,
                        )} - ${formatTime(selectedSchedule.end_time)}`}
                      />

                      <IconText
                        icon={locationIcon}
                        text="Studio Bella Pilates"
                      />
                    </div>

                    {notes && (
                      <div className="mt-6 rounded-[16px] bg-[#FCF8F5] p-4 text-[#6F5645]">
                        <p className="font-semibold text-[#2F2118]">
                          Observaciones
                        </p>
                        <p className="mt-2">{notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-5">
                {!reservationCreated ? (
                  <>
                    <Button2
                      variant="primary"
                      size="lg"
                      icon={calendarIcon}
                      className="w-full text-xl"
                      disabled={creatingReservation}
                      onClick={handleCreateReservation}
                    >
                      {creatingReservation
                        ? "Confirmando..."
                        : "Confirmar reserva"}
                    </Button2>

                    <Button2
                      variant="outline"
                      size="lg"
                      className="w-full text-xl"
                      onClick={() => navigate("/reservations/user-data")}
                    >
                      Volver atrás
                    </Button2>
                  </>
                ) : (
                  <>
                    <Button2
                      variant="primary"
                      size="lg"
                      icon={calendarIcon}
                      className="w-full text-xl"
                      onClick={() => navigate("/reservations")}
                    >
                      Ver mis reservas
                    </Button2>

                    <Button2
                      variant="outline"
                      size="lg"
                      className="w-full text-xl"
                      onClick={() => navigate("/dashboard")}
                    >
                      Volver al inicio
                    </Button2>
                  </>
                )}
              </div>
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
    <div className="flex items-center gap-4">
      <img src={icon} alt="" className="h-6 w-6" />
      <span>{text || "—"}</span>
    </div>
  );
}