import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { getAdminUsers } from "../../../services/adminUsersService";
import {
  createAdminReservation,
  getAdminAvailableSchedules,
} from "../../../services/adminReservationsService";

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function formatTime(time) {
  return time ? time.slice(0, 5) : "—";
}

function getDuration(startTime, endTime, classDuration) {
  if (classDuration) return `${classDuration} min`;

  if (!startTime || !endTime) return "—";

  const [startHour, startMinute] = startTime.slice(0, 5).split(":").map(Number);
  const [endHour, endMinute] = endTime.slice(0, 5).split(":").map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const duration = end - start;

  return duration > 0 ? `${duration} min` : "—";
}

function mapScheduleFromApi(schedule) {
  const classData = schedule.class || {};

  const activeReservationsCount =
    schedule.active_reservations_count ||
    schedule.reservations_count ||
    0;

  const maxCapacity = classData.max_capacity || 0;

  return {
    id: schedule.id,
    className: classData.title || "Clase sin nombre",
    instructor: schedule.instructor_name || classData.instructor_name || "Sin instructor",
    day: dayLabels[schedule.day_of_week] || schedule.day_of_week || "—",
    time: formatTime(schedule.start_time),
    duration: getDuration(schedule.start_time, schedule.end_time, classData.duration),
    room: schedule.room || "Sin sala",
    places: `${activeReservationsCount} / ${maxCapacity || "—"}`,
    raw: schedule,
  };
}

function mapUserFromApi(user) {
  return {
    id: user.id,
    name: [user.name, user.surname].filter(Boolean).join(" "),
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export function CreateReservationPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const [form, setForm] = useState({
    userId: "",
    scheduleId: "",
    notes: "",
  });

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadData() {
    try {
      setLoadingData(true);

      const [usersResponse, schedulesResponse] = await Promise.all([
        getAdminUsers(),
        getAdminAvailableSchedules(),
      ]);

      const usersData =
        usersResponse.users || usersResponse.data || usersResponse || [];

      const schedulesData =
        schedulesResponse.data ||
        schedulesResponse.schedules ||
        schedulesResponse ||
        [];

      const activeUsers = usersData
        .filter((user) => user.role === "user")
        .filter((user) => user.status === "active")
        .map(mapUserFromApi);

      setUsers(activeUsers);
      setSchedules(schedulesData.map(mapScheduleFromApi));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar datos de reserva");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === Number(form.userId)),
    [users, form.userId],
  );

  const selectedSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === Number(form.scheduleId)),
    [schedules, form.scheduleId],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.userId || !form.scheduleId) {
      showToast("Selecciona un usuario y un horario");
      return;
    }

    try {
      setSaving(true);

      await createAdminReservation({
        user_id: Number(form.userId),
        schedule_id: Number(form.scheduleId),
        notes: form.notes || null,
      });

      showToast("Reserva creada correctamente");

      setTimeout(() => {
        navigate("/admin/reservations");
      }, 1200);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Error al crear la reserva";

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
          onClick={() => navigate("/admin/reservations")}
          className="mb-6 font-semibold text-primary"
        >
          ← Volver a reservas
        </button>

        <h1 className="text-4xl font-semibold text-[#2F2118]">
          Nueva reserva
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Crea una reserva para un usuario desde el panel de administración.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]"
        >
          <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-primary">
              Información de la reserva
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
                      {user.name} — {user.email}
                    </option>
                  ))}
                </select>

                {!loadingData && users.length === 0 && (
                  <p className="mt-2 text-sm text-[#8B6B52]">
                    No hay usuarios activos disponibles.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Horario disponible *
                </label>

                <select
                  name="scheduleId"
                  value={form.scheduleId}
                  onChange={handleChange}
                  disabled={loadingData}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary disabled:opacity-60"
                >
                  <option value="">
                    {loadingData
                      ? "Cargando horarios..."
                      : "Seleccionar horario"}
                  </option>

                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.className} — {schedule.day} {schedule.time} —{" "}
                      {schedule.instructor}
                    </option>
                  ))}
                </select>

                {!loadingData && schedules.length === 0 && (
                  <p className="mt-2 text-sm text-[#8B6B52]">
                    No hay horarios disponibles con plazas libres.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#2F2118]">
                    Notas internas
                  </label>

                  <span className="text-xs text-[#8B6B52]">
                    {form.notes.length}/200
                  </span>
                </div>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  maxLength={200}
                  rows={6}
                  placeholder="Añade una nota para el equipo..."
                  className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/reservations")}
                className="rounded-[14px] border border-[#E8DDD3] px-8 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving || loadingData}
                className="rounded-[14px] bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Creando..." : "Crear reserva"}
              </button>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2F2118]">Resumen</h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-[18px] border border-[#E8DDD3] bg-white p-5">
                <p className="text-xs font-medium text-[#8B6B52]">Usuario</p>

                <p className="mt-2 font-semibold text-[#2F2118]">
                  {selectedUser?.name || "Sin seleccionar"}
                </p>

                <p className="mt-1 text-sm text-[#6F5645]">
                  {selectedUser?.email || "Selecciona un usuario"}
                </p>
              </div>

              <div className="rounded-[18px] border border-[#E8DDD3] bg-white p-5">
                <p className="text-xs font-medium text-[#8B6B52]">Clase</p>

                <p className="mt-2 font-semibold text-[#2F2118]">
                  {selectedSchedule?.className || "Sin seleccionar"}
                </p>

                {selectedSchedule && (
                  <div className="mt-3 space-y-2 text-sm text-[#6F5645]">
                    <p>
                      {selectedSchedule.day} · {selectedSchedule.time}
                    </p>
                    <p>Duración: {selectedSchedule.duration}</p>
                    <p>Instructor: {selectedSchedule.instructor}</p>
                    <p>Sala: {selectedSchedule.room}</p>
                    <p>Plazas: {selectedSchedule.places}</p>
                  </div>
                )}
              </div>

              <div className="rounded-[18px] border border-[#E8DDD3] bg-[#FCF8F5] p-5">
                <p className="text-sm leading-6 text-[#6F5645]">
                  Solo aparecen usuarios activos y horarios activos con plazas
                  disponibles.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </section>
    </AdminLayout>
  );
}