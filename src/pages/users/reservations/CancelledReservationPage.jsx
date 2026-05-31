import { useNavigate } from "react-router-dom";

import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";

import classImage from "../../../assets/dashboard-hero.jpg";
import policyIcon from "../../../assets/policy.svg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import profileIcon from "../../../assets/perfil.svg";

export function CancelledReservationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F3EE]">
      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[900px] p-5 text-center lg:p-10">
          <div className="mx-auto mt-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#3F7A35] text-6xl text-white">
            ✓
          </div>

          <h1 className="mt-8 text-5xl font-semibold text-[#2E6F37]">
            Reserva cancelada
          </h1>

          <p className="mt-5 text-2xl text-[#2F2118]">
            Tu reserva ha sido cancelada correctamente.
          </p>

          <div className="mx-auto mt-8 h-1 w-20 bg-[#2E6F37]" />

          <section className="mt-12 rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 text-left shadow-sm">
            <h3 className="text-2xl font-semibold text-[#2F2118]">
              Resumen de la reserva cancelada
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
              <img
                src={classImage}
                alt=""
                className="h-[220px] w-full rounded-[22px] object-cover"
              />

              <div>
                <h4 className="text-3xl font-semibold text-[#2F2118]">
                  Pilates Reformer
                </h4>

                <p className="mt-3 text-xl text-[#2F2118]">
                  Intermedio • 60 min
                </p>

                <div className="mt-6 space-y-4 text-[#2F2118]">
                  <IconText icon={calendarIcon} text="Martes, 28 de mayo de 2024" />
                  <IconText icon={clockIcon} text="18:00 - 19:00" />
                  <IconText icon={locationIcon} text="Studio Bella Pilates" />
                  <IconText icon={profileIcon} text="Profesora Laura" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[28px] border border-[#DDEED2] bg-[#F8FFF5] p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DDEED2]">
              <img src={calendarIcon} alt="" className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-[#2E6F37]">
              ¿Qué te gustaría hacer ahora?
            </h2>

            <div className="mt-8 space-y-5">
              <Button2
                variant="primary"
                className="w-full"
                onClick={() => navigate("/reservations")}
              >
                Ver mis reservas
              </Button2>

              <Button2
                variant="outline"
                className="w-full"
                onClick={() => navigate("/reservations/new")}
              >
                Reservar otra clase
              </Button2>
            </div>
          </section>

          <section className="mt-10 flex items-center gap-4 rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 text-left shadow-sm">
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