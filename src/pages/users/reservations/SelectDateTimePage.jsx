import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";

import classImage from "../../../assets/dashboard-hero.jpg";

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

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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
  return schedule.day_of_week || schedule.day || "";
}

function getSchedulesByDay(schedules) {
  return schedules.reduce((acc, schedule) => {
    const day = getScheduleDay(schedule);

    if (!acc[day]) {
      acc[day] = [];
    }

    acc[day].push(schedule);

    return acc;
  }, {});
}

export function SelectDateTimePage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

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

  useEffect(() => {
    const storedClass = localStorage.getItem("bella_pilates_reservation_class");

    if (!storedClass) {
      navigate("/reservations/new", { replace: true });
      return;
    }

    try {
      const parsedClass = JSON.parse(storedClass);

      setSelectedClass(parsedClass);

      const firstSchedule = parsedClass.schedules?.[0];

      if (firstSchedule) {
        setSelectedDay(getScheduleDay(firstSchedule));
        setSelectedScheduleId(firstSchedule.id);
      }
    } catch (error) {
      console.error("Error al leer la clase seleccionada:", error);
      navigate("/reservations/new", { replace: true });
    }
  }, [navigate]);

  const schedules = selectedClass?.schedules || [];

  const schedulesByDay = useMemo(() => {
    return getSchedulesByDay(schedules);
  }, [schedules]);

  const availableDays = useMemo(() => {
    return dayOrder.filter((day) => schedulesByDay[day]?.length > 0);
  }, [schedulesByDay]);

  const daySchedules = schedulesByDay[selectedDay] || [];

  const selectedSchedule = schedules.find(
    (schedule) => schedule.id === selectedScheduleId,
  );

  const handleContinue = () => {
    if (!selectedSchedule) {
      showToast("Selecciona un horario para continuar");
      return;
    }

    localStorage.setItem(
      "bella_pilates_reservation_schedule",
      JSON.stringify(selectedSchedule),
    );

    navigate("/reservations/user-data");
  };

  if (!selectedClass) {
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
              Elige tu clase favorita, selecciona la fecha y asegura tu lugar.
            </p>

            <div className="my-10 flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-1 items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${
                      step === 2
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

            <h2 className="text-2xl font-semibold text-[#2F2118]">
              2. Elige día y hora
            </h2>

            <p className="mt-2 text-[#6F5645]">
              Selecciona uno de los horarios disponibles para esta clase.
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <h3 className="mb-6 text-xl font-semibold text-[#2F2118]">
                  Días disponibles
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {availableDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);

                        const firstSchedule = schedulesByDay[day]?.[0];
                        setSelectedScheduleId(firstSchedule?.id || null);
                      }}
                      className={`rounded-[18px] border px-5 py-4 text-left font-semibold transition ${
                        selectedDay === day
                          ? "border-primary bg-primary text-white"
                          : "border-[#E8DDD3] bg-white text-[#2F2118] hover:border-primary"
                      }`}
                    >
                      {dayLabels[day] || day}
                    </button>
                  ))}
                </div>

                <h3 className="mb-6 mt-10 text-xl font-semibold text-[#2F2118]">
                  Horarios disponibles
                </h3>

                {daySchedules.length === 0 ? (
                  <div className="rounded-[18px] border border-[#E8DDD3] bg-[#FCF8F5] px-5 py-8 text-center text-[#6F5645]">
                    No hay horarios disponibles para este día.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {daySchedules.map((schedule) => {
                      const isSelected = selectedScheduleId === schedule.id;

                      return (
                        <button
                          key={schedule.id}
                          type="button"
                          onClick={() => setSelectedScheduleId(schedule.id)}
                          className={`rounded-[18px] border px-5 py-4 text-left transition ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-[#E8DDD3] bg-white text-[#2F2118] hover:border-primary"
                          }`}
                        >
                          <p className="text-lg font-semibold">
                            {formatTime(schedule.start_time)} -{" "}
                            {formatTime(schedule.end_time)}
                          </p>

                          <p
                            className={`mt-1 text-sm ${
                              isSelected ? "text-white/80" : "text-[#6F5645]"
                            }`}
                          >
                            Plazas ocupadas:{" "}
                            {schedule.active_reservations_count || 0}/
                            {selectedClass.max_capacity}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <aside className="h-fit rounded-[22px] border border-[#E8DDD3] bg-[#FCF8F5] p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-[#2F2118]">
                  Clase seleccionada
                </h3>

                <img
                  src={getImageUrl(selectedClass.image)}
                  alt={selectedClass.title}
                  className="mt-5 h-[150px] w-full rounded-[16px] object-cover"
                />

                <h4 className="mt-4 text-2xl font-semibold text-[#2F2118]">
                  {selectedClass.title}
                </h4>

                <p className="mt-2 text-[#6F5645]">
                  {formatLevel(selectedClass.level)}
                  <span className="mx-2">•</span>
                  {selectedClass.duration} min
                </p>

                {selectedSchedule && (
                  <div className="mt-6 rounded-[18px] bg-white p-4 text-[#2F2118]">
                    <p className="font-semibold">
                      {dayLabels[getScheduleDay(selectedSchedule)] ||
                        getScheduleDay(selectedSchedule)}
                    </p>

                    <p className="mt-2 text-[#6F5645]">
                      {formatTime(selectedSchedule.start_time)} -{" "}
                      {formatTime(selectedSchedule.end_time)}
                    </p>
                  </div>
                )}
              </aside>
            </div>

            <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Button2
                variant="outline"
                size="lg"
                onClick={() => navigate("/reservations/new")}
              >
                Atrás
              </Button2>

              <Button2
                variant="primary"
                size="lg"
                disabled={!selectedSchedule}
                onClick={handleContinue}
              >
                Continuar
              </Button2>
            </div>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}