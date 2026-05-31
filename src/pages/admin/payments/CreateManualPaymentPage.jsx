import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { getAdminUsers } from "../../../services/adminUsersService";
import { getAdminPlans } from "../../../services/adminPlansService";
import { createAdminPayment } from "../../../services/adminPaymentsService";

const methodToApi = {
  Efectivo: "cash",
  Tarjeta: "card",
  Bizum: "bizum",
  Transferencia: "bank_transfer",
};

const statusToApi = {
  Completado: "paid",
  Pendiente: "pending",
  Fallido: "failed",
  Reembolsado: "refunded",
};

function getData(response, key) {
  return response.data || response[key] || response || [];
}

function formatDateInput(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function addMonths(dateValue, months) {
  const date = new Date(dateValue);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export function CreateManualPaymentPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const [form, setForm] = useState({
    userId: "",
    planId: "",
    amount: "",
    method: "Efectivo",
    status: "Completado",
    startsAt: formatDateInput(),
    expiresAt: addMonths(formatDateInput(), 1),
    transactionId: "",
  });

  const selectedUser = useMemo(
    () => users.find((user) => user.id === Number(form.userId)),
    [users, form.userId],
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === Number(form.planId)),
    [plans, form.planId],
  );

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadFormData() {
    try {
      setLoadingData(true);

      const [usersResponse, plansResponse] = await Promise.all([
        getAdminUsers(),
        getAdminPlans(),
      ]);

      setUsers(getData(usersResponse, "users"));
      setPlans(getData(plansResponse, "plans"));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar datos");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadFormData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePlanChange = (event) => {
    const planId = event.target.value;
    const plan = plans.find((item) => item.id === Number(planId));

    setForm((currentForm) => ({
      ...currentForm,
      planId,
      amount: plan?.price ?? currentForm.amount,
    }));
  };

  const validateForm = () => {
    if (!form.userId) return "Selecciona un usuario.";
    if (!form.planId) return "Selecciona un plan.";
    if (!form.amount || Number(form.amount) < 0) {
      return "Introduce un importe válido.";
    }
    if (!form.startsAt) return "Selecciona una fecha de inicio.";
    if (!form.expiresAt) return "Selecciona una fecha de vencimiento.";
    if (form.expiresAt < form.startsAt) {
      return "La fecha de vencimiento no puede ser anterior al inicio.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showToast(validationError);
      return;
    }

    try {
      setSaving(true);

      await createAdminPayment({
        user_id: Number(form.userId),
        plan_id: Number(form.planId),
        amount: Number(form.amount),
        payment_method: methodToApi[form.method],
        status: statusToApi[form.status],
        transaction_id: form.transactionId.trim() || null,
        starts_at: form.startsAt,
        expires_at: form.expiresAt,
      });

      showToast("Pago registrado correctamente");

      setTimeout(() => {
        navigate("/admin/payments");
      }, 1200);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Error al registrar pago";

      showToast(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <button
          type="button"
          onClick={() => navigate("/admin/payments")}
          className="mb-6 font-semibold text-primary"
        >
          ← Volver a pagos
        </button>

        <h1 className="text-4xl font-semibold text-[#2F2118]">
          Registrar pago manual
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Añade un pago recibido por efectivo, tarjeta, Bizum o transferencia.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]"
        >
          <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-primary">
              Información del pago
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Usuario *
                </label>

                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  disabled={loadingData}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary disabled:opacity-60"
                >
                  <option value="">
                    {loadingData ? "Cargando usuarios..." : "Seleccionar usuario"}
                  </option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {[user.name, user.surname].filter(Boolean).join(" ")} —{" "}
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Plan *
                  </label>

                  <select
                    name="planId"
                    value={form.planId}
                    onChange={handlePlanChange}
                    disabled={loadingData}
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary disabled:opacity-60"
                  >
                    <option value="">
                      {loadingData ? "Cargando planes..." : "Seleccionar plan"}
                    </option>

                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} — {plan.price} €
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Importe *
                  </label>

                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Ej. 45.00"
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Select
                  label="Método *"
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  options={["Efectivo", "Tarjeta", "Bizum", "Transferencia"]}
                />

                <Select
                  label="Estado *"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["Completado", "Pendiente", "Fallido", "Reembolsado"]}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Referencia
                  </label>

                  <input
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    placeholder="Ej. F-2026-001"
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Inicio del plan *
                  </label>

                  <input
                    type="date"
                    name="startsAt"
                    value={form.startsAt}
                    onChange={handleChange}
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Vencimiento del plan *
                  </label>

                  <input
                    type="date"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/payments")}
                className="rounded-[14px] border border-[#E8DDD3] px-8 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-[14px] bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Registrando..." : "Registrar pago"}
              </button>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2F2118]">Resumen</h2>

            <div className="mt-6 space-y-5">
              <SummaryBlock
                label="Usuario"
                title={
                  selectedUser
                    ? [selectedUser.name, selectedUser.surname]
                        .filter(Boolean)
                        .join(" ")
                    : "Sin seleccionar"
                }
                text={selectedUser?.email || "Selecciona un usuario"}
              />

              <SummaryBlock
                label="Plan"
                title={selectedPlan?.name || "Sin plan"}
                text={selectedPlan ? `${selectedPlan.price} €` : "Selecciona un plan"}
              />

              <div className="rounded-[18px] border border-[#E8DDD3] bg-white p-5">
                <p className="text-xs font-medium text-[#8B6B52]">Pago</p>

                <div className="mt-3 space-y-2 text-sm text-[#6F5645]">
                  <p>Importe: {form.amount ? `${form.amount} €` : "—"}</p>
                  <p>Método: {form.method}</p>
                  <p>Estado: {form.status}</p>
                  <p>Inicio: {form.startsAt || "—"}</p>
                  <p>Vencimiento: {form.expiresAt || "—"}</p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </section>
    </AdminLayout>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function SummaryBlock({ label, title, text }) {
  return (
    <div className="rounded-[18px] border border-[#E8DDD3] bg-white p-5">
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-2 font-semibold text-[#2F2118]">{title}</p>
      <p className="mt-1 text-sm text-[#6F5645]">{text}</p>
    </div>
  );
}