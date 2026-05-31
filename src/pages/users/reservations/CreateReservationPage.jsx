import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";

import { getAvailableSchedules } from "../../../services/userReservationsService";

import classImage from "../../../assets/dashboard-hero.jpg";

function getImageUrl(image) {
  if (!image) return classImage;

  if (image.startsWith("http")) {
    return image;
  }

  return `http://localhost:8000/storage/${image}`;
}

function getData(response) {
  return response.data || response.schedules || response || [];
}

function formatLevel(level) {
  const levels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return levels[level] || level || "Todos los niveles";
}

function getUniqueClassesFromSchedules(schedules) {
  const classesMap = new Map();

  schedules.forEach((schedule) => {
    if (!schedule.class) return;

    if (!classesMap.has(schedule.class.id)) {
      classesMap.set(schedule.class.id, {
        ...schedule.class,
        schedules: [],
      });
    }

    classesMap.get(schedule.class.id).schedules.push(schedule);
  });

  return Array.from(classesMap.values());
}

export function CreateReservationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const navigate = useNavigate();

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

  async function loadAvailableSchedules() {
    try {
      setLoadingSchedules(true);

      const response = await getAvailableSchedules();
      const data = getData(response);

      setAvailableSchedules(data);

      const classes = getUniqueClassesFromSchedules(data);

      if (classes.length > 0) {
        setSelectedClassId(classes[0].id);
      }
    } catch (error) {
      console.error("Error al cargar horarios disponibles:", error);
      showToast("Error al cargar clases disponibles");
    } finally {
      setLoadingSchedules(false);
    }
  }

  useEffect(() => {
    loadAvailableSchedules();
  }, []);

  const availableClasses = useMemo(() => {
    return getUniqueClassesFromSchedules(availableSchedules);
  }, [availableSchedules]);

  const selectedClass = availableClasses.find(
    (classItem) => classItem.id === selectedClassId,
  );

  const handleContinue = () => {
    if (!selectedClass) {
      showToast("Selecciona una clase para continuar");
      return;
    }

    localStorage.setItem(
      "bella_pilates_reservation_class",
      JSON.stringify(selectedClass),
    );

    navigate("/reservations/date-time");
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
                      step === 1
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
              1. Elige el tipo de clase
            </h2>

            <p className="mt-2 text-[#6F5645]">
              Selecciona una clase con horarios disponibles.
            </p>

            {loadingSchedules ? (
              <div className="mt-8 rounded-[22px] border border-[#E8DDD3] bg-[#FCF8F5] px-6 py-12 text-center text-[#6F5645]">
                Cargando clases disponibles...
              </div>
            ) : availableClasses.length === 0 ? (
              <div className="mt-8 rounded-[22px] border border-[#E8DDD3] bg-[#FCF8F5] px-6 py-12 text-center">
                <h3 className="text-xl font-semibold text-[#2F2118]">
                  No hay clases disponibles
                </h3>

                <p className="mt-2 text-[#6F5645]">
                  En este momento no hay horarios activos con plazas libres.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {availableClasses.map((item) => {
                  const isSelected = selectedClassId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedClassId(item.id)}
                      className={`grid w-full gap-5 rounded-[22px] border bg-secondary p-4 text-left transition lg:grid-cols-[260px_1fr_auto] lg:items-center ${
                        isSelected
                          ? "border-primary shadow-sm"
                          : "border-[#E8DDD3] hover:border-primary/60"
                      }`}
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-[150px] w-full rounded-[18px] object-cover"
                      />

                      <div>
                        <h3 className="text-2xl font-semibold text-[#2F2118]">
                          {item.title}
                        </h3>

                        <p className="mt-3 max-w-xl leading-relaxed text-[#6F5645]">
                          {item.description ||
                            "Clase disponible en Bella Pilates."}
                        </p>

                        <p className="mt-4 text-[#2F2118]">
                          Nivel: {formatLevel(item.level)}
                          <span className="mx-3">•</span>
                          {item.duration} min
                          <span className="mx-3">•</span>
                          {item.schedules.length} horario
                          {item.schedules.length === 1 ? "" : "s"} disponible
                          {item.schedules.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                          isSelected ? "border-primary" : "border-[#CBB8A8]"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-between">
              <Button2
                variant="outline"
                size="lg"
                onClick={() => navigate("/reservations")}
              >
                Cancelar
              </Button2>

              <Button2
                variant="primary"
                size="lg"
                disabled={loadingSchedules || availableClasses.length === 0}
                onClick={handleContinue}
              >
                Continuar →
              </Button2>
            </div>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}