import { AdminStatCard } from "../../../components/admin/AdminStatCard";

import policyIcon from "../../../assets/policy.svg";
import clockIcon from "../../../assets/reloj.svg";
import cardIcon from "../../../assets/horarios.svg";
import warningIcon from "../../../assets/warning.svg";

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export function PaymentStatsCards({ payments = [] }) {
  const completedPayments = payments.filter(
    (payment) => payment.status === "Completado",
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pendiente",
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "Fallido",
  );

  const completedTotal = completedPayments.reduce(
    (total, payment) => total + Number(payment.amountNumber || 0),
    0,
  );

  const pendingTotal = pendingPayments.reduce(
    (total, payment) => total + Number(payment.amountNumber || 0),
    0,
  );

  const failedTotal = failedPayments.reduce(
    (total, payment) => total + Number(payment.amountNumber || 0),
    0,
  );

  const stats = [
    {
      icon: policyIcon,
      title: "Ingresos completados",
      value: formatMoney(completedTotal),
      percentage: `${completedPayments.length} pagos`,
      comparison: "pagos completados",
    },
    {
      icon: cardIcon,
      title: "Pagos registrados",
      value: payments.length,
      percentage: `${completedPayments.length} completados`,
      comparison: "total de pagos",
    },
    {
      icon: clockIcon,
      title: "Pendientes",
      value: formatMoney(pendingTotal),
      percentage: `${pendingPayments.length} pagos`,
      comparison: "pendientes",
    },
    {
      icon: warningIcon,
      title: "Impagados",
      value: formatMoney(failedTotal),
      percentage: `${failedPayments.length} pagos`,
      comparison: "fallidos",
    },
  ];

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AdminStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}