import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { PaymentStatsCards } from "./PaymentStatsCards";
import { PaymentFilters } from "./PaymentFilters";
import { PaymentRow } from "./PaymentRow";
import { ViewPaymentModal } from "./ViewPaymentModal";

import {
  getAdminPayments,
  updateAdminPaymentStatus,
} from "../../../services/adminPaymentsService";

const ITEMS_PER_PAGE = 5;

const statusLabels = {
  paid: "Completado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const statusToApi = {
  Completado: "paid",
  Pendiente: "pending",
  Fallido: "failed",
  Reembolsado: "refunded",
};

const methodLabels = {
  cash: "Efectivo",
  card: "Tarjeta",
  bizum: "Bizum",
  bank_transfer: "Transferencia",
};

const tabs = ["Todos", "Completado", "Pendiente", "Fallido", "Reembolsado"];

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value) {
  return value ? value.slice(11, 16) : "";
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function getData(response) {
  return response.data || response.payments || response || [];
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}

function matchesDateFilter(payment, dateFilter) {
  if (dateFilter === "all") return true;

  const paymentDate = new Date(payment.raw?.created_at);

  if (Number.isNaN(paymentDate.getTime())) return false;

  const today = new Date();

  if (dateFilter === "today") {
    return isSameDay(paymentDate, today);
  }

  if (dateFilter === "week") {
    const firstDayOfWeek = new Date(today);
    const day = firstDayOfWeek.getDay() || 7;

    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - day + 1);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return paymentDate >= firstDayOfWeek && paymentDate <= lastDayOfWeek;
  }

  if (dateFilter === "month") {
    return (
      paymentDate.getMonth() === today.getMonth() &&
      paymentDate.getFullYear() === today.getFullYear()
    );
  }

  return true;
}

function mapPaymentFromApi(payment) {
  const user = payment.user || {};
  const plan = payment.plan || {};

  return {
    id: payment.id,
    userName:
      [user.name, user.surname].filter(Boolean).join(" ") || "Sin usuario",
    userEmail: user.email || "Sin email",
    concept: plan.name || "Pago manual",
    detail:
      payment.starts_at && payment.expires_at
        ? `${formatDate(payment.starts_at)} - ${formatDate(payment.expires_at)}`
        : "Sin periodo",
    amount: formatMoney(payment.amount),
    amountNumber: Number(payment.amount || 0),
    status: statusLabels[payment.status] || payment.status,
    method:
      methodLabels[payment.payment_method] || payment.payment_method || "—",
    date: formatDate(payment.created_at),
    time: formatTime(payment.created_at),
    invoice: payment.transaction_id || "—",
    raw: payment,
  };
}

export function AdminPaymentsPage() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Todos");
  const [viewingPayment, setViewingPayment] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadPayments() {
    try {
      setLoadingPayments(true);

      const response = await getAdminPayments();
      const data = getData(response);

      setPayments(data.map(mapPaymentFromApi));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar pagos");
    } finally {
      setLoadingPayments(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const methodOptions = useMemo(() => {
    return ["Todos", ...new Set(payments.map((payment) => payment.method))];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        payment.userName.toLowerCase().includes(searchValue) ||
        payment.userEmail.toLowerCase().includes(searchValue) ||
        payment.concept.toLowerCase().includes(searchValue);

      const matchesMethod =
        methodFilter === "Todos" || payment.method === methodFilter;

      const matchesTab = activeTab === "Todos" || payment.status === activeTab;

      const matchesDate = matchesDateFilter(payment, dateFilter);

      return matchesSearch && matchesMethod && matchesTab && matchesDate;
    });
  }, [payments, search, methodFilter, activeTab, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ITEMS_PER_PAGE),
  );

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter, activeTab, dateFilter]);

  const completedTotal = payments
    .filter((payment) => payment.status === "Completado")
    .reduce((total, payment) => total + payment.amountNumber, 0);

  const pendingTotal = payments
    .filter((payment) => payment.status === "Pendiente")
    .reduce((total, payment) => total + payment.amountNumber, 0);

  const failedTotal = payments
    .filter((payment) => payment.status === "Fallido")
    .reduce((total, payment) => total + payment.amountNumber, 0);

  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Pagos - Bella Pilates", 14, 18);

    doc.setFontSize(10);
    doc.text(`Total exportado: ${filteredPayments.length}`, 14, 26);

    autoTable(doc, {
      startY: 34,
      head: [
        [
          "Usuario",
          "Email",
          "Concepto",
          "Importe",
          "Estado",
          "Método",
          "Fecha",
          "Factura",
        ],
      ],
      body: filteredPayments.map((payment) => [
        payment.userName,
        payment.userEmail,
        payment.concept,
        payment.amount,
        payment.status,
        payment.method,
        `${payment.date} ${payment.time}`,
        payment.invoice,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [143, 91, 63],
      },
    });

    doc.save("pagos-bella-pilates.pdf");
    showToast("PDF exportado correctamente");
  };

  const handleChangeStatus = async (paymentId, newStatus) => {
    try {
      await updateAdminPaymentStatus(paymentId, statusToApi[newStatus]);

      showToast("Estado del pago actualizado");
      await loadPayments();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar estado");
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">Pagos</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona todos los pagos, suscripciones y facturas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleExportPdf}
              className="rounded-[14px] border border-[#E8DDD3] bg-white px-6 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
            >
              Exportar PDF
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/payments/new")}
              className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              + Registrar pago manual
            </button>
          </div>
        </div>

        <PaymentStatsCards payments={payments} />

        <div className="mt-6 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
            <PaymentFilters
              search={search}
              setSearch={setSearch}
              methodFilter={methodFilter}
              setMethodFilter={setMethodFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              methodOptions={methodOptions}
            />

            <div className="mt-7 overflow-x-auto border-b border-[#E8DDD3]">
              <div className="flex min-w-max gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-[#6F5645] hover:text-primary"
                    }`}
                  >
                    {tab} ({getTabCount(tab, payments)})
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:hidden">
              {loadingPayments ? (
                <EmptyState text="Cargando pagos..." />
              ) : paginatedPayments.length === 0 ? (
                <EmptyState text="No hay pagos para mostrar." />
              ) : (
                paginatedPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onView={() => setViewingPayment(payment)}
                    onChangeStatus={handleChangeStatus}
                  />
                ))
              )}
            </div>

            <div className="mt-6 hidden overflow-visible xl:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-[#FCF8F5] text-left text-sm text-[#2F2118]">
                    <th className="rounded-l-[14px] px-4 py-4 font-semibold">
                      Usuario
                    </th>
                    <th className="px-4 py-4 font-semibold">Plan / Concepto</th>
                    <th className="px-4 py-4 font-semibold">Importe</th>
                    <th className="px-4 py-4 font-semibold">Estado</th>
                    <th className="px-4 py-4 font-semibold">Método</th>
                    <th className="px-4 py-4 font-semibold">Fecha</th>
                    <th className="px-4 py-4 font-semibold">Factura</th>
                    <th className="w-[140px] rounded-r-[14px] px-4 py-4 text-center font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8DDD3]">
                  {loadingPayments ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-5 py-10 text-center text-[#6F5645]"
                      >
                        Cargando pagos...
                      </td>
                    </tr>
                  ) : paginatedPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-5 py-10 text-center text-[#6F5645]"
                      >
                        No hay pagos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((payment) => (
                      <PaymentRow
                        key={payment.id}
                        payment={payment}
                        onView={() => setViewingPayment(payment)}
                        onChangeStatus={handleChangeStatus}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
              <p>
                Mostrando {paginatedPayments.length} de{" "}
                {filteredPayments.length} pagos
              </p>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
              <h2 className="font-semibold text-[#2F2118]">Resumen de pagos</h2>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryRow
                  label="Ingresos completados"
                  value={formatMoney(completedTotal)}
                />
                <SummaryRow
                  label="Pagos completados"
                  value={`${
                    payments.filter(
                      (payment) => payment.status === "Completado",
                    ).length
                  } pagos`}
                />
                <SummaryRow
                  label="Pendientes"
                  value={formatMoney(pendingTotal)}
                />
                <SummaryRow
                  label="Impagados"
                  value={formatMoney(failedTotal)}
                />
              </div>

              <button
                type="button"
                onClick={handleExportPdf}
                className="mt-6 w-full rounded-[14px] border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-[#FCF8F5]"
              >
                Exportar reporte
              </button>
            </div>

            <div className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
              <h2 className="font-semibold text-[#2F2118]">Acciones rápidas</h2>

              <div className="mt-5 space-y-4 text-sm">
                <QuickAction
                  title="Registrar pago manual"
                  text="Añadir un pago recibido fuera de la web"
                  onClick={() => navigate("/admin/payments/new")}
                />

                <QuickAction
                  title="Ver pendientes"
                  text="Filtrar pagos pendientes de confirmar"
                  onClick={() => setActiveTab("Pendiente")}
                />

                <QuickAction
                  title="Ver fallidos"
                  text="Consultar pagos no completados"
                  onClick={() => setActiveTab("Fallido")}
                />

                <QuickAction
                  title="Exportar pagos"
                  text="Descargar PDF con el listado actual"
                  onClick={handleExportPdf}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
              <h2 className="font-semibold text-[#2F2118]">
                ¿Necesitas ayuda?
              </h2>

              <p className="mt-3 text-sm text-[#6F5645]">
                Revisa los pagos pendientes o exporta el listado para llevar el
                control administrativo del centro.
              </p>

              <button
                type="button"
                onClick={() => setActiveTab("Pendiente")}
                className="mt-5 font-semibold text-primary"
              >
                Ver pagos pendientes →
              </button>
            </div>
          </aside>
        </div>
      </section>

      <ViewPaymentModal
        payment={viewingPayment}
        onClose={() => setViewingPayment(null)}
      />
    </AdminLayout>
  );
}

function PaymentCard({ payment, onView, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (status) => {
    onChangeStatus(payment.id, status);
    setIsMenuOpen(false);
  };

  return (
    <article className="w-full min-w-0 rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-[#2F2118]">
            {payment.userName}
          </h3>

          <p className="mt-1 break-words text-sm text-[#6F5645]">
            {payment.userEmail}
          </p>
        </div>

        <StatusBadge status={payment.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info
          label="Concepto"
          value={payment.concept}
          subValue={payment.detail}
        />
        <Info label="Importe" value={payment.amount} />
        <Info label="Método" value={payment.method} />
        <Info label="Factura" value={payment.invoice} />
        <Info label="Fecha" value={payment.date} subValue={payment.time} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onView}
          className="w-full rounded-[12px] border border-[#E8DDD3] px-4 py-3 font-semibold text-primary transition hover:bg-[#FCF8F5]"
        >
          Ver
        </button>

        <div ref={menuRef} className="relative w-full">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="w-full rounded-[12px] border border-[#E8DDD3] px-4 py-3 font-semibold text-primary transition hover:bg-[#FCF8F5]"
          >
            Cambiar estado
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-full rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl sm:w-[220px]">
              {["Completado", "Pendiente", "Fallido", "Reembolsado"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className="w-full rounded-[12px] px-4 py-3 text-left text-sm font-medium text-[#2F2118] transition hover:bg-[#FCF8F5]"
                  >
                    Marcar como {status}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completado: "bg-[#E8F6EC] text-[#1F8A4C]",
    Pendiente: "bg-[#FFF1D8] text-[#D98300]",
    Fallido: "bg-[#FDECEC] text-[#D64545]",
    Reembolsado: "bg-[#EFEFEF] text-[#666666]",
  };

  return (
    <span
      className={`w-fit rounded-full px-4 py-1 text-xs font-semibold ${
        styles[status] || "bg-[#EFEFEF] text-[#666666]"
      }`}
    >
      {status}
    </span>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#6F5645]">{label}</span>
      <span className="font-semibold text-[#2F2118]">{value}</span>
    </div>
  );
}

function QuickAction({ title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-[14px] p-3 text-left transition hover:bg-[#FCF8F5]"
    >
      <p className="font-semibold text-primary">{title}</p>
      <p className="mt-1 text-xs text-[#6F5645]">{text}</p>
    </button>
  );
}

function Info({ label, value, subValue }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#2F2118]">
        {value || "—"}
      </p>
      {subValue && <p className="text-xs text-[#6F5645]">{subValue}</p>}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[18px] border border-[#E8DDD3] bg-white px-5 py-10 text-center text-[#6F5645]">
      {text}
    </div>
  );
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => page - 1)}
        className="rounded-[10px] border border-[#E8DDD3] px-4 py-2 disabled:opacity-40"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`rounded-[10px] px-4 py-2 ${
              currentPage === page
                ? "bg-primary text-white"
                : "border border-[#E8DDD3]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((page) => page + 1)}
        className="rounded-[10px] border border-[#E8DDD3] px-4 py-2 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}

function getTabCount(tab, payments) {
  if (tab === "Todos") return payments.length;

  return payments.filter((payment) => payment.status === tab).length;
}