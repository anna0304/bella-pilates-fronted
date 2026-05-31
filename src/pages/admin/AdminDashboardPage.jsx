import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../components/admin/AdminLayout";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { AdminQuickActionCard } from "../../components/admin/AdminQuickActionCard";

import { getAdminUsers } from "../../services/adminUsersService";
import { getAdminClasses } from "../../services/adminClassesService";
import { getAdminSchedules } from "../../services/adminSchedulesService";
import { getAdminReservations } from "../../services/adminReservationsService";

import usersIcon from "../../assets/perfil.svg";
import calendarIcon from "../../assets/horarios.svg";
import classIcon from "../../assets/niveles.svg";
import videoIcon from "../../assets/video.svg";
import mailIcon from "../../assets/mail.svg";
import clockIcon from "../../assets/reloj.svg";

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const statusLabels = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  no_show: "No asistió",
};

function formatTime(value) {
  return value ? value.slice(0, 5) : "—";
}

function isToday(value) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getArrayFromResponse(response, key) {
  if (Array.isArray(response)) return response;
  return response?.data || response?.[key] || [];
}

function mapReservation(reservation) {
  const schedule = reservation.schedule || {};
  const classData = schedule.class || {};
  const user = reservation.user || {};

  return {
    id: reservation.id,
    time: formatTime(schedule.start_time),
    className: classData.title || "Clase sin nombre",
    userName: [user.name, user.surname].filter(Boolean).join(" ") || "Sin usuario",
    status: statusLabels[reservation.status] || reservation.status,
    createdAt: reservation.created_at,
  };
}

function mapSchedule(schedule) {
  const classData = schedule.class || schedule.class_model || {};

  return {
    id: schedule.id,
    time: formatTime(schedule.start_time),
    className: classData.title || "Clase sin nombre",
    instructor: schedule.instructor_name || "Sin instructor",
    day: dayLabels[schedule.day_of_week] || schedule.day_of_week || "—",
    booked: schedule.reservations_count || 0,
    capacity: classData.max_capacity || 0,
    isActive: Boolean(schedule.is_active),
  };
}

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const [
        usersResponse,
        classesResponse,
        schedulesResponse,
        reservationsResponse,
      ] = await Promise.all([
        getAdminUsers(),
        getAdminClasses(),
        getAdminSchedules(),
        getAdminReservations(),
      ]);

      setUsers(getArrayFromResponse(usersResponse, "users"));
      setClasses(getArrayFromResponse(classesResponse, "classes"));
      setSchedules(getArrayFromResponse(schedulesResponse, "schedules"));
      setReservations(getArrayFromResponse(reservationsResponse, "reservations"));
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const activeUsers = useMemo(() => {
    return users.filter(
      (user) => user.status === "active" || user.is_active === true,
    ).length;
  }, [users]);

  const activeClasses = useMemo(() => {
    return classes.filter((classItem) => classItem.is_active).length;
  }, [classes]);

  const activeSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.is_active).length;
  }, [schedules]);

  const todayReservations = useMemo(() => {
    return reservations.filter((reservation) => isToday(reservation.created_at));
  }, [reservations]);

  const latestTodayReservations = useMemo(() => {
    return todayReservations
      .map(mapReservation)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 5);
  }, [todayReservations]);

  const upcomingSchedules = useMemo(() => {
    return schedules
      .map(mapSchedule)
      .filter((schedule) => schedule.isActive)
      .slice(0, 5);
  }, [schedules]);

  const stats = [
    {
      icon: usersIcon,
      title: "Usuarios activos",
      value: loading ? "..." : activeUsers,
      percentage: `${users.length} total`,
      comparison: "usuarios registrados",
    },
    {
      icon: calendarIcon,
      title: "Reservas hoy",
      value: loading ? "..." : todayReservations.length,
      percentage: `${reservations.length} total`,
      comparison: "reservas registradas",
    },
    {
      icon: classIcon,
      title: "Clases activas",
      value: loading ? "..." : activeClasses,
      percentage: `${classes.length} total`,
      comparison: "clases creadas",
    },
    {
      icon: clockIcon,
      title: "Horarios activos",
      value: loading ? "..." : activeSchedules,
      percentage: `${schedules.length} total`,
      comparison: "horarios creados",
    },
  ];

  return (
    <AdminLayout>
      <section className="mt-8">
        <h1 className="text-4xl font-semibold text-[#2F2118]">Dashboard</h1>

        <p className="mt-2 text-[#6F5645]">Resumen general de tu centro</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <AdminStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2F2118]">
                Reservas de hoy
              </h2>

              <button
                type="button"
                onClick={() => navigate("/admin/reservations")}
                className="text-sm font-semibold text-primary"
              >
                Ver todas
              </button>
            </div>

            <div className="divide-y divide-[#E8DDD3]">
              {loading ? (
                <EmptyState text="Cargando reservas..." />
              ) : latestTodayReservations.length === 0 ? (
                <EmptyState text="No hay reservas registradas hoy." />
              ) : (
                latestTodayReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="grid gap-3 py-4 text-sm md:grid-cols-[70px_1fr_1fr_auto] md:items-center"
                  >
                    <span className="font-semibold text-[#2F2118]">
                      {reservation.time}
                    </span>

                    <span className="font-medium text-[#2F2118]">
                      {reservation.className}
                    </span>

                    <span className="text-[#6F5645]">
                      {reservation.userName}
                    </span>

                    <StatusBadge status={reservation.status} />
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2F2118]">
                Próximas clases
              </h2>

              <button
                type="button"
                onClick={() => navigate("/admin/schedules")}
                className="text-sm font-semibold text-primary"
              >
                Ver calendario
              </button>
            </div>

            <div className="divide-y divide-[#E8DDD3]">
              {loading ? (
                <EmptyState text="Cargando horarios..." />
              ) : upcomingSchedules.length === 0 ? (
                <EmptyState text="No hay horarios activos." />
              ) : (
                upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="grid gap-3 py-4 text-sm md:grid-cols-[60px_1fr_auto] md:items-center"
                  >
                    <span className="font-semibold text-[#2F2118]">
                      {schedule.time}
                    </span>

                    <div>
                      <p className="font-semibold text-[#2F2118]">
                        {schedule.className}
                      </p>
                      <p className="text-[#6F5645]">
                        {schedule.day} · con {schedule.instructor}
                      </p>
                    </div>

                    <span className="font-semibold text-[#2F2118]">
                      {schedule.booked} / {schedule.capacity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2F2118]">
              Acciones rápidas
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <AdminQuickActionCard
                icon={usersIcon}
                label="Crear usuario"
                onClick={() => navigate("/admin/users")}
              />

              <AdminQuickActionCard
                icon={classIcon}
                label="Crear clase"
                onClick={() => navigate("/admin/classes")}
              />

              <AdminQuickActionCard
                icon={clockIcon}
                label="Gestionar horarios"
                onClick={() => navigate("/admin/schedules")}
              />

              <AdminQuickActionCard
                icon={calendarIcon}
                label="Crear reserva"
                onClick={() => navigate("/admin/reservations/new")}
              />

              <AdminQuickActionCard
                icon={mailIcon}
                label="Enviar mensaje"
                onClick={() => navigate("/admin/messages")}
              />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2F2118]">
                Actividad del centro
              </h2>

              <span className="rounded-[12px] border border-[#E8DDD3] bg-white px-4 py-2 text-sm text-[#6F5645]">
                Esta semana
              </span>
            </div>

            <div className="space-y-4">
              <ActivityRow
                label="Reservas totales"
                value={reservations.length}
                max={Math.max(reservations.length, users.length, schedules.length, 1)}
              />

              <ActivityRow
                label="Usuarios activos"
                value={activeUsers}
                max={Math.max(reservations.length, users.length, schedules.length, 1)}
              />

              <ActivityRow
                label="Horarios activos"
                value={activeSchedules}
                max={Math.max(reservations.length, users.length, schedules.length, 1)}
              />

              <ActivityRow
                label="Clases activas"
                value={activeClasses}
                max={Math.max(reservations.length, users.length, schedules.length, 1)}
              />
            </div>
          </article>
        </div>
      </section>
    </AdminLayout>
  );
}

function EmptyState({ text }) {
  return <p className="py-6 text-center text-sm text-[#6F5645]">{text}</p>;
}

function StatusBadge({ status }) {
  const styles = {
    Confirmada: "bg-[#E8F6EC] text-[#1F8A4C]",
    Cancelada: "bg-[#FDECEC] text-[#D64545]",
    Completada: "bg-[#E8F0FE] text-[#2D5BBF]",
    "No asistió": "bg-[#EFEFEF] text-[#666666]",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-[#EFEFEF] text-[#666666]"
      }`}
    >
      {status}
    </span>
  );
}

function ActivityRow({ label, value, max }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-[#2F2118]">{label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#EFE5DD]">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}