import { useNavigate } from "react-router-dom";

import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";

import policyIcon from "../../../assets/policy.svg";

export function CancellationPolicyPage() {
  const navigate = useNavigate();

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

          <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE5DD]">
                <img src={policyIcon} alt="" className="h-8 w-8" />
              </div>

              <h1 className="text-4xl font-semibold text-[#2F2118]">
                Política de cancelación
              </h1>
            </div>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-[#6F5645]">
              <p>
                Puedes cancelar tu reserva hasta 12 horas antes del inicio de la clase sin penalización.
              </p>

              <p>
                Si cancelas fuera de ese plazo, la clase puede contar como utilizada según las condiciones de tu plan.
              </p>

              <p>
                Si tienes un motivo especial, puedes contactar con el centro para revisar tu caso.
              </p>
            </div>

            <Button2
              variant="primary"
              className="mt-10"
              onClick={() => navigate("/reservations")}
            >
              Volver a mis reservas
            </Button2>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}