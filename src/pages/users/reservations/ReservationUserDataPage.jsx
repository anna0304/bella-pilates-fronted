import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";

import { useAuth } from "../../../hooks/useAuth";

import classImage from "../../../assets/dashboard-hero.jpg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import policyIcon from "../../../assets/policy.svg";

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

export function ReservationUserDataPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const selectedClass = JSON.parse(
    localStorage.getItem("bella_pilates_reservation_class") || "null",
  );

  const selectedSchedule = JSON.parse(
    localStorage.getItem("bella_pilates_reservation_schedule") || "null",
  );

  const handleContinue = () => {
    localStorage.setItem("bella_pilates_reservation_notes", notes);
    navigate("/reservations/confirm");
  };

  if (!selectedClass || !selectedSchedule) {
    navigate("/reservations/new", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
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
              Revisa tus datos antes de confirmar tu reserva.
            </p>

            <div className="my-10 flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-1 items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${
                      step === 3
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
              3. Tus datos
            </h2>

            <p className="mt-2 text-[#6F5645]">
              Estos datos se tomarán de tu cuenta.
            </p>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <InfoField
                  label="Nombre completo"
                  value={user?.name || "No disponible"}
                />

                <InfoField
                  label="Correo electrónico"
                  value={user?.email || "No disponible"}
                />

                <InfoField
                  label="Teléfono"
                  value={user?.phone || "No disponible"}
                />

                <div>
                  <label className="mb-2 block font-medium text-[#2F2118]">
                    ¿Tienes alguna condición o lesión que debamos tener en
                    cuenta? (opcional)
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={5}
                    placeholder="Cuéntanos aquí..."
                    className="w-full resize-none rounded-[16px] border border-[#E8DDD3] bg-white p-5 outline-none transition focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-4 rounded-[20px] border border-[#E8DDD3] bg-[#FCF8F5] p-5">
                  <img src={policyIcon} alt="" className="h-8 w-8" />

                  <div>
                    <h4 className="font-semibold text-[#2F2118]">
                      Tu información está segura con nosotros.
                    </h4>

                    <p className="text-sm text-[#6F5645]">
                      La usamos únicamente para gestionar tu reserva.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-fit rounded-[22px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-[#2F2118]">
                  Resumen de tu reserva
                </h3>

                <div className="mt-5">
                  <img
                    src={getImageUrl(selectedClass.image)}
                    alt={selectedClass.title}
                    className="h-[140px] w-full rounded-[16px] object-cover"
                  />

                  <h4 className="mt-4 text-2xl font-semibold text-[#2F2118]">
                    {selectedClass.title}
                  </h4>

                  <p className="mt-2 text-[#6F5645]">
                    {formatLevel(selectedClass.level)}
                    <span className="mx-2">•</span>
                    {selectedClass.duration} min
                  </p>

                  <div className="mt-6 space-y-4 text-[#6F5645]">
                    <IconText
                      icon={calendarIcon}
                      text={
                        dayLabels[getScheduleDay(selectedSchedule)] ||
                        getScheduleDay(selectedSchedule)
                      }
                    />

                    <IconText
                      icon={clockIcon}
                      text={`${formatTime(selectedSchedule.start_time)} - ${formatTime(
                        selectedSchedule.end_time,
                      )}`}
                    />

                    <IconText
                      icon={locationIcon}
                      text="Studio Bella Pilates"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 md:flex-row md:justify-between">
              <Button2
                variant="outline"
                size="lg"
                onClick={() => navigate("/reservations/date-time")}
              >
                Atrás
              </Button2>

              <Button2
                variant="primary"
                size="lg"
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

function InfoField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block font-medium text-[#2F2118]">
        {label}
      </label>

      <div className="w-full rounded-[16px] border border-[#E8DDD3] bg-[#FCF8F5] px-5 py-4 text-[#6F5645]">
        {value}
      </div>
    </div>
  );
}

function IconText({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt="" className="h-5 w-5" />
      <span>{text || "—"}</span>
    </div>
  );
}