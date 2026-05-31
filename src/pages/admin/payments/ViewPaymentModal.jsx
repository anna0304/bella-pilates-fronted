import profileIcon from "../../../assets/perfil.svg";
import calendarIcon from "../../../assets/horarios.svg";
import policyIcon from "../../../assets/policy.svg";

export function ViewPaymentModal({ payment, onClose }) {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Detalle del pago
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Información completa del pago.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <div className="rounded-[22px] bg-[#FCF8F5] p-6">
          <h3 className="break-words text-3xl font-semibold text-[#2F2118]">
            {payment.amount}
          </h3>

          <p className="mt-2 break-words text-[#6F5645]">
            {payment.concept} · {payment.status}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoItem icon={profileIcon} label="Usuario" value={payment.userName} />
          <InfoItem icon={policyIcon} label="Email" value={payment.userEmail} />
          <InfoItem icon={policyIcon} label="Concepto" value={payment.concept} />
          <InfoItem icon={policyIcon} label="Método" value={payment.method} />
          <InfoItem
            icon={calendarIcon}
            label="Fecha"
            value={`${payment.date} · ${payment.time}`}
          />
          <InfoItem icon={policyIcon} label="Factura" value={payment.invoice} />
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-[18px] border border-[#E8DDD3] bg-white p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
        <img src={icon} alt="" className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
        <p className="mt-1 break-words font-semibold text-[#2F2118]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}