import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { ReportStatsCards } from "./ReportStatsCards";
import { ReportLineChart } from "./ReportLineChart";
import { ReportProgressList } from "./ReportProgressList";
import { ReportDonutCard } from "./ReportDonutCard";
import { RecentActivityCard } from "./RecentActivityCard";

import { getAdminUsers } from "../../../services/adminUsersService";
import { getAdminReservations } from "../../../services/adminReservationsService";
import { getAdminPayments } from "../../../services/adminPaymentsService";
import { getAdminRecordedClasses } from "../../../services/adminRecordedClassesService";
import { getAdminSchedules } from "../../../services/adminSchedulesService";

const paymentStatusLabels = {
  paid: "Completados",
  pending: "Pendientes",
  failed: "Fallidos",
  refunded: "Reembolsados",
};

const days = [
  { key: 1, label: "Lun" },
  { key: 2, label: "Mar" },
  { key: 3, label: "Mié" },
  { key: 4, label: "Jue" },
  { key: 5, label: "Vie" },
  { key: 6, label: "Sáb" },
  { key: 0, label: "Dom" },
];

const months = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function getData(response, key) {
  return response.data || response[key] || response || [];
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function getItemDate(item) {
  return new Date(item.created_at || item.createdAt);
}

function isSameMonth(dateValue, baseDate = new Date()) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getMonth() === baseDate.getMonth() &&
    date.getFullYear() === baseDate.getFullYear()
  );
}

function isSameWeek(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  const firstDayOfWeek = new Date(today);
  const day = firstDayOfWeek.getDay() || 7;

  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - day + 1);
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

function isSameYear(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return false;

  return date.getFullYear() === new Date().getFullYear();
}

function filterItemsByDate(items, dateFilter) {
  return items.filter((item) => {
    const date = getItemDate(item);

    if (Number.isNaN(date.getTime())) return false;

    if (dateFilter === "week") return isSameWeek(date);
    if (dateFilter === "month") return isSameMonth(date);
    if (dateFilter === "year") return isSameYear(date);

    return true;
  });
}

function getClassNameFromReservation(reservation) {
  return (
    reservation.schedule?.class?.title ||
    reservation.class?.title ||
    "Clase sin nombre"
  );
}

function getScheduleTimeFromReservation(reservation) {
  return reservation.schedule?.start_time?.slice(0, 5) || "Sin hora";
}

function getUserName(user) {
  return [user.name, user.surname].filter(Boolean).join(" ") || "Usuario";
}

function toPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function buildProgressItems(counter, totalLabel = "") {
  const items = Object.entries(counter)
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (items.length > 0) return items;

  return [{ label: totalLabel || "Sin datos", value: 0 }];
}

function buildRecentActivities({
  users,
  reservations,
  payments,
  recordedClasses,
}) {
  const activities = [
    ...users.slice(0, 3).map((user) => ({
      title: "Nuevo usuario registrado",
      text: getUserName(user),
      time: user.created_at || user.createdAt,
      type: "user",
    })),
    ...reservations.slice(0, 3).map((reservation) => ({
      title: "Nueva reserva",
      text: getClassNameFromReservation(reservation),
      time: reservation.created_at,
      type: "reservation",
    })),
    ...payments.slice(0, 3).map((payment) => ({
      title: "Pago recibido",
      text: `${payment.plan?.name || "Pago manual"} - ${getUserName(
        payment.user || {},
      )}`,
      time: payment.created_at,
      type: "payment",
    })),
    ...recordedClasses.slice(0, 3).map((video) => ({
      title: "Nueva clase grabada",
      text: video.title || "Clase grabada",
      time: video.created_at,
      type: "video",
    })),
  ];

  return activities
    .filter((activity) => activity.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);
}

function getReportLabel(dateFilter) {
  const labels = {
    week: "esta semana",
    month: "este mes",
    year: "este año",
  };

  return labels[dateFilter] || "periodo seleccionado";
}

export function AdminReportsPage() {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [dateFilter, setDateFilter] = useState("month");
  const [loading, setLoading] = useState(true);

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

  async function loadReportsData() {
    try {
      setLoading(true);

      const [
        usersResponse,
        reservationsResponse,
        paymentsResponse,
        recordedClassesResponse,
        schedulesResponse,
      ] = await Promise.all([
        getAdminUsers(),
        getAdminReservations(),
        getAdminPayments(),
        getAdminRecordedClasses(),
        getAdminSchedules(),
      ]);

      setUsers(getData(usersResponse, "users"));
      setReservations(getData(reservationsResponse, "reservations"));
      setPayments(getData(paymentsResponse, "payments"));
      setRecordedClasses(getData(recordedClassesResponse, "recordedClasses"));
      setSchedules(getData(schedulesResponse, "schedules"));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar reportes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReportsData();
  }, []);

  const reportData = useMemo(() => {
    const filteredUsers = filterItemsByDate(users, dateFilter);
    const filteredReservations = filterItemsByDate(reservations, dateFilter);
    const filteredPayments = filterItemsByDate(payments, dateFilter);
    const filteredRecordedClasses = filterItemsByDate(
      recordedClasses,
      dateFilter,
    );

    const activeUsers = users.filter((user) => {
      return user.status === "active" || user.status === "Activo";
    });

    const paidPayments = filteredPayments.filter(
      (payment) => payment.status === "paid",
    );

    const periodIncome = paidPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );

    const completedReservations = filteredReservations.filter(
      (reservation) => reservation.status === "completed",
    );

    const noShowReservations = filteredReservations.filter(
      (reservation) => reservation.status === "no_show",
    );

    const attendanceTotal =
      completedReservations.length + noShowReservations.length;

    const attendanceRate = toPercent(
      completedReservations.length,
      attendanceTotal,
    );

    const weeklyReservations = days.map((day) => {
      const value = filteredReservations.filter((reservation) => {
        return new Date(reservation.created_at).getDay() === day.key;
      }).length;

      return {
        day: day.label,
        value,
      };
    });

    const classCounter = {};
    filteredReservations.forEach((reservation) => {
      const className = getClassNameFromReservation(reservation);
      classCounter[className] = (classCounter[className] || 0) + 1;
    });

    const scheduleCounter = {};
    filteredReservations.forEach((reservation) => {
      const time = getScheduleTimeFromReservation(reservation);
      scheduleCounter[time] = (scheduleCounter[time] || 0) + 1;
    });

    const paymentCounter = {
      Completados: 0,
      Pendientes: 0,
      Fallidos: 0,
      Reembolsados: 0,
    };

    filteredPayments.forEach((payment) => {
      const label = paymentStatusLabels[payment.status];

      if (label) {
        paymentCounter[label] += 1;
      }
    });

    const paymentTotal = Object.values(paymentCounter).reduce(
      (total, value) => total + value,
      0,
    );

    const paymentData = Object.entries(paymentCounter).map(([name, value]) => ({
      name,
      value: toPercent(value, paymentTotal),
    }));

    const attendanceData = [
      {
        name: "Asistieron",
        value: attendanceRate,
      },
      {
        name: "No asistieron",
        value: 100 - attendanceRate,
      },
    ];

    const newUsers = months.map((month, index) => {
      const value = filteredUsers.filter((user) => {
        const createdAt = new Date(user.created_at || user.createdAt);

        return (
          !Number.isNaN(createdAt.getTime()) &&
          createdAt.getMonth() === index &&
          createdAt.getFullYear() === new Date().getFullYear()
        );
      }).length;

      return {
        month,
        users: value,
      };
    });

    return {
      stats: {
        activeUsers: activeUsers.length,
        monthReservations: filteredReservations.length,
        monthIncome: periodIncome,
        recordedViews: filteredRecordedClasses.reduce(
          (total, video) => total + Number(video.views || 0),
          0,
        ),
        attendanceRate,
      },
      weeklyReservations,
      popularClasses: buildProgressItems(classCounter, "Sin clases"),
      busySchedules: buildProgressItems(scheduleCounter, "Sin horarios"),
      paymentData,
      attendanceData,
      newUsers,
      recentActivities: buildRecentActivities({
        users: filteredUsers,
        reservations: filteredReservations,
        payments: filteredPayments,
        recordedClasses: filteredRecordedClasses,
      }),
      totalPayments: paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0,
      ),
      totalReservations: filteredReservations.length,
      schedulesCount: schedules.length,
    };
  }, [users, reservations, payments, recordedClasses, schedules, dateFilter]);

  const handleExportReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte general - Bella Pilates", 14, 18);

    doc.setFontSize(10);
    doc.text(`Periodo: ${getReportLabel(dateFilter)}`, 14, 30);
    doc.text(`Usuarios activos: ${reportData.stats.activeUsers}`, 14, 37);
    doc.text(
      `Reservas: ${reportData.stats.monthReservations}`,
      14,
      44,
    );
    doc.text(
      `Ingresos: ${formatMoney(reportData.stats.monthIncome)}`,
      14,
      51,
    );
    doc.text(`Tasa de asistencia: ${reportData.stats.attendanceRate}%`, 14, 58);

    autoTable(doc, {
      startY: 68,
      head: [["Clase", "Reservas"]],
      body: reportData.popularClasses.map((item) => [item.label, item.value]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [143, 91, 63],
      },
    });

    doc.save("reporte-bella-pilates.pdf");
    showToast("Reporte exportado correctamente");
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">
              Reportes
            </h1>

            <p className="mt-2 text-[#6F5645]">
              Resumen general del rendimiento del estudio.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>

            <button
              type="button"
              onClick={handleExportReport}
              className="rounded-[14px] border border-[#E8DDD3] bg-white px-6 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
            >
              Exportar reporte
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary px-5 py-10 text-center text-[#6F5645]">
            Cargando reportes...
          </div>
        ) : (
          <>
            <ReportStatsCards stats={reportData.stats} />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.8fr_0.8fr]">
              <ReportLineChart
                title="Reservas del periodo"
                data={reportData.weeklyReservations}
              />

              <ReportProgressList
                title="Clases más populares"
                labelTitle="Clase"
                valueTitle="Reservas"
                items={reportData.popularClasses}
                linkText="Ver todas las clases"
                color="purple"
              />

              <ReportProgressList
                title="Horarios con más reservas"
                labelTitle="Horario"
                valueTitle="Reservas"
                items={reportData.busySchedules}
                linkText="Ver todos los horarios"
                color="green"
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-4">
              <ReportDonutCard
                title="Estado de pagos"
                data={reportData.paymentData}
                centerText=""
                footer={`Total: ${formatMoney(reportData.totalPayments)}`}
              />

              <ReportLineChart
                title="Usuarios nuevos"
                data={reportData.newUsers}
                dataKey="users"
                xKey="month"
                type="bar"
                compact
              />

              <ReportDonutCard
                title="Asistencia a clases"
                data={reportData.attendanceData}
                centerText={`${reportData.stats.attendanceRate}%`}
                footer={`Total reservas: ${reportData.totalReservations}`}
              />

              <RecentActivityCard activities={reportData.recentActivities} />
            </div>

            <div className="mt-6 rounded-[14px] bg-[#F1E8FF] px-5 py-4 text-sm font-medium text-[#7A3FA0]">
              Los datos mostrados corresponden a {getReportLabel(dateFilter)}.
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  );
}