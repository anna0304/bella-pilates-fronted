import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { ScheduleStatsCards } from "./ScheduleStatsCards";
import { ScheduleFilters } from "./ScheduleFilters";
import { ScheduleRow } from "./ScheduleRow";
import { ViewScheduleModal } from "./ViewScheduleModal";
import { EditScheduleModal } from "./EditScheduleModal";

import { getAdminUsers } from "../../../services/adminUsersService";

import {
  deactivateAdminSchedule,
  getAdminSchedules,
  updateAdminSchedule,
} from "../../../services/adminSchedulesService";

const ITEMS_PER_PAGE = 5;

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function getDuration(startTime, endTime) {
  if (!startTime || !endTime) return "-- min";

  const [startHour, startMinute] = startTime.slice(0, 5).split(":").map(Number);
  const [endHour, endMinute] = endTime.slice(0, 5).split(":").map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const duration = end - start;

  return duration > 0 ? `${duration} min` : "-- min";
}

function mapScheduleFromApi(schedule) {
  const classData = schedule.class || schedule.class_model || {};

  return {
    id: schedule.id,
    classId: schedule.class_id,
    className: classData.title || "Clase sin nombre",
    instructor: schedule.instructor_name || "Sin instructor",
    date: "Semanal",
    day: dayLabels[schedule.day_of_week] || schedule.day_of_week,
    dayOfWeek: schedule.day_of_week,
    startTime: schedule.start_time?.slice(0, 5) || "",
    endTime: schedule.end_time?.slice(0, 5) || "",
    duration: getDuration(schedule.start_time, schedule.end_time),
    capacity: classData.max_capacity || 0,
    booked: schedule.reservations_count || 0,
    room: schedule.room || "Sin sala",
    status: schedule.is_active ? "Programado" : "Cancelado",
    notes: schedule.notes || "",
    raw: schedule,
  };
}

function mapDayToApi(day) {
  const map = {
    Lunes: "monday",
    Martes: "tuesday",
    Miércoles: "wednesday",
    Jueves: "thursday",
    Viernes: "friday",
    Sábado: "saturday",
    Domingo: "sunday",
  };

  return map[day] || day;
}

export function AdminSchedulesPage() {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("Todas");
  const [instructorFilter, setInstructorFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

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

  async function loadSchedules() {
    try {
      setLoadingSchedules(true);

      const [schedulesResponse, usersResponse] = await Promise.all([
        getAdminSchedules(),
        getAdminUsers(),
      ]);

      const schedulesData =
        schedulesResponse.data ||
        schedulesResponse.schedules ||
        schedulesResponse ||
        [];

      const usersData =
        usersResponse.data || usersResponse.users || usersResponse || [];

      setSchedules(schedulesData.map(mapScheduleFromApi));

      const instructorNames = usersData
        .filter((user) => user.role === "instructor")
        .map((user) =>
          [user.name, user.surname].filter(Boolean).join(" ").trim(),
        )
        .filter(Boolean);

      setInstructors([...new Set(instructorNames)]);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar horarios");
    } finally {
      setLoadingSchedules(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const classOptions = useMemo(() => {
    return [
      "Todas",
      ...new Set(
        schedules.map((schedule) => schedule.className).filter(Boolean),
      ),
    ];
  }, [schedules]);

  const instructorOptions = useMemo(() => {
    return ["Todos", ...instructors];
  }, [instructors]);

  const statusOptions = useMemo(() => {
    return [
      "Todos",
      ...new Set(schedules.map((schedule) => schedule.status).filter(Boolean)),
    ];
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        schedule.className.toLowerCase().includes(searchValue) ||
        schedule.instructor.toLowerCase().includes(searchValue) ||
        schedule.room.toLowerCase().includes(searchValue) ||
        schedule.day.toLowerCase().includes(searchValue);

      const matchesClass =
        classFilter === "Todas" || schedule.className === classFilter;

      const matchesInstructor =
        instructorFilter === "Todos" || schedule.instructor === instructorFilter;

      const matchesStatus =
        statusFilter === "Todos" || schedule.status === statusFilter;

      return matchesSearch && matchesClass && matchesInstructor && matchesStatus;
    });
  }, [schedules, search, classFilter, instructorFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE),
  );

  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSchedules.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSchedules, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, classFilter, instructorFilter, statusFilter]);

  const buildPayload = (
    schedule,
    isActive = schedule.status === "Programado",
  ) => ({
    class_id: schedule.classId,
    day_of_week: schedule.dayOfWeek || mapDayToApi(schedule.day),
    start_time: schedule.startTime,
    end_time: schedule.endTime,
    instructor_name: schedule.instructor,
    room: schedule.room,
    is_active: isActive,
  });

  const handleToggleStatus = async (schedule) => {
    try {
      if (schedule.status === "Programado") {
        await deactivateAdminSchedule(schedule.id);
      } else {
        await updateAdminSchedule(schedule.id, buildPayload(schedule, true));
      }

      showToast("Estado del horario actualizado");
      await loadSchedules();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar estado");
    }
  };

  const handleEditSchedule = async (updatedSchedule) => {
    try {
      await updateAdminSchedule(
        updatedSchedule.id,
        buildPayload(updatedSchedule),
      );

      setEditingSchedule(null);
      showToast("Horario actualizado correctamente");
      await loadSchedules();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar horario");
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">Horarios</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona los horarios programados de las clases.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/schedules/new")}
            className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            + Nuevo horario
          </button>
        </div>

        <ScheduleStatsCards schedules={schedules} />

        <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
          <ScheduleFilters
            search={search}
            setSearch={setSearch}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            instructorFilter={instructorFilter}
            setInstructorFilter={setInstructorFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            classOptions={classOptions}
            instructorOptions={instructorOptions}
            statusOptions={statusOptions}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            {loadingSchedules ? (
              <EmptyState text="Cargando horarios..." />
            ) : paginatedSchedules.length === 0 ? (
              <EmptyState text="No hay horarios para mostrar." />
            ) : (
              paginatedSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onView={() => setViewingSchedule(schedule)}
                  onEdit={() => setEditingSchedule(schedule)}
                  onToggleStatus={() => handleToggleStatus(schedule)}
                />
              ))
            )}
          </div>

          <div className="mt-6 hidden overflow-hidden xl:block">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#FCF8F5] text-left text-sm text-[#2F2118]">
                  <th className="rounded-l-[14px] px-4 py-4 font-semibold">
                    Clase
                  </th>
                  <th className="px-4 py-4 font-semibold">Instructor</th>
                  <th className="px-4 py-4 font-semibold">Día</th>
                  <th className="px-4 py-4 font-semibold">Horario</th>
                  <th className="px-4 py-4 font-semibold">Sala</th>
                  <th className="px-4 py-4 font-semibold">Cupos</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="rounded-r-[14px] px-4 py-4 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DDD3]">
                {loadingSchedules ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      Cargando horarios...
                    </td>
                  </tr>
                ) : paginatedSchedules.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      No hay horarios para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginatedSchedules.map((schedule) => (
                    <ScheduleRow
                      key={schedule.id}
                      schedule={schedule}
                      onView={() => setViewingSchedule(schedule)}
                      onEdit={() => setEditingSchedule(schedule)}
                      onToggleStatus={() => handleToggleStatus(schedule)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
            <p>
              Mostrando {paginatedSchedules.length} de{" "}
              {filteredSchedules.length} horarios
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
      </section>

      <ViewScheduleModal
        schedule={viewingSchedule}
        onClose={() => setViewingSchedule(null)}
        onEdit={(schedule) => {
          setViewingSchedule(null);
          setEditingSchedule(schedule);
        }}
      />

      <EditScheduleModal
        schedule={editingSchedule}
        onClose={() => setEditingSchedule(null)}
        onSave={handleEditSchedule}
      />
    </AdminLayout>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[18px] border border-[#E8DDD3] bg-white px-5 py-10 text-center text-[#6F5645]">
      {text}
    </div>
  );
}

function ScheduleCard({ schedule, onView, onEdit, onToggleStatus }) {
  const isProgrammed = schedule?.status?.toLowerCase() === "programado";

  return (
    <article className="rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#2F2118]">
            {schedule.className}
          </h3>

          <p className="mt-1 text-sm text-[#6F5645]">
            {schedule.day} · {schedule.date}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleStatus}
          className={`shrink-0 rounded-full px-4 py-1 text-xs font-semibold ${
            isProgrammed
              ? "bg-[#E8F6EC] text-[#1F8A4C]"
              : "bg-[#FDECEC] text-[#D64545]"
          }`}
        >
          {schedule.status}
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Instructor" value={schedule.instructor} />
        <Info
          label="Horario"
          value={`${schedule.startTime || "--:--"} - ${
            schedule.endTime || "--:--"
          }`}
          subValue={schedule.duration}
        />
        <Info label="Sala" value={schedule.room} />
        <Info label="Cupos" value={`${schedule.booked} / ${schedule.capacity}`} />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 font-semibold text-primary transition hover:bg-[#FCF8F5]"
        >
          Ver
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-[12px] bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Editar
        </button>
      </div>
    </article>
  );
}

function Info({ label, value, subValue }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-1 font-semibold text-[#2F2118]">{value || "—"}</p>
      {subValue && <p className="text-xs text-[#6F5645]">{subValue}</p>}
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