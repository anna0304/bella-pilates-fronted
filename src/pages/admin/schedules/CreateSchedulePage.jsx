import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { getAdminClasses } from "../../../services/adminClassesService";
import { createAdminSchedule } from "../../../services/adminSchedulesService";
import { getAdminUsers } from "../../../services/adminUsersService";
import { getAdminRooms } from "../../../services/adminRoomsService";

const days = [
  { label: "Lunes", value: "monday" },
  { label: "Martes", value: "tuesday" },
  { label: "Miércoles", value: "wednesday" },
  { label: "Jueves", value: "thursday" },
  { label: "Viernes", value: "friday" },
  { label: "Sábado", value: "saturday" },
  { label: "Domingo", value: "sunday" },
];

export function CreateSchedulePage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  const [form, setForm] = useState({
    classId: "",
    instructor: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    duration: "",
    room: "",
  });

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === Number(form.classId)),
    [classes, form.classId],
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [classesResponse, usersResponse, roomsResponse] =
          await Promise.all([
            getAdminClasses(),
            getAdminUsers(),
            getAdminRooms(),
          ]);

        const classesData =
          classesResponse.data ||
          classesResponse.classes ||
          classesResponse ||
          [];

        const usersData =
          usersResponse.data || usersResponse.users || usersResponse || [];

        const roomsData =
          roomsResponse.data || roomsResponse.rooms || roomsResponse || [];

        setClasses(classesData);
        setRooms(roomsData);

        const instructorNames = usersData
          .filter((user) => user.role === "instructor")
          .map((user) =>
            [user.name, user.surname].filter(Boolean).join(" ").trim(),
          )
          .filter(Boolean);

        setInstructors([...new Set(instructorNames)]);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!form.startTime || !form.endTime) return;

    const [startHour, startMinute] = form.startTime.split(":").map(Number);
    const [endHour, endMinute] = form.endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const duration = end - start;

    setForm((currentForm) => ({
      ...currentForm,
      duration: duration > 0 ? `${duration} min` : "-- min",
    }));
  }, [form.startTime, form.endTime]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.classId ||
      !form.instructor ||
      !form.dayOfWeek ||
      !form.startTime ||
      !form.endTime
    ) {
      return;
    }

    try {
      const payload = {
        class_id: Number(form.classId),
        day_of_week: form.dayOfWeek,
        start_time: form.startTime,
        end_time: form.endTime,
        instructor_name: form.instructor,
        room: form.room || null,
      };

      await createAdminSchedule(payload);

      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
        navigate("/admin/schedules");
      }, 1800);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toastVisible} message="Horario creado correctamente" />

      <section className="mt-8">
        <button
          type="button"
          onClick={() => navigate("/admin/schedules")}
          className="mb-6 font-semibold text-primary"
        >
          ← Volver a horarios
        </button>

        <h1 className="text-4xl font-semibold text-[#2F2118]">
          Nuevo horario
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Crea un nuevo horario para una clase.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm"
        >
          <section>
            <h2 className="text-xl font-semibold text-primary">
              Información de la clase
            </h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Clase *
                </label>

                <select
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar clase</option>

                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Instructor *
                </label>

                <select
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar instructor</option>

                  {instructors.map((instructor) => (
                    <option key={instructor} value={instructor}>
                      {instructor}
                    </option>
                  ))}
                </select>

                {instructors.length === 0 && (
                  <p className="mt-2 text-sm text-[#8B6B52]">
                    No hay instructores registrados. Crea un usuario con rol
                    Instructor.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="my-8 border-t border-[#E8DDD3]" />

          <section>
            <h2 className="text-xl font-semibold text-primary">Día y hora</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Día *
                </label>

                <select
                  name="dayOfWeek"
                  value={form.dayOfWeek}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar día</option>

                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Hora de inicio *
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Hora de fin *
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Duración
                </label>

                <input
                  value={form.duration || "-- min"}
                  readOnly
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-[#F7EFE8] px-5 py-4 text-[#6F5645] outline-none"
                />
              </div>
            </div>
          </section>

          <div className="my-8 border-t border-[#E8DDD3]" />

          <section>
            <h2 className="text-xl font-semibold text-primary">Ubicación</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Capacidad de la clase
                </label>

                <input
                  value={selectedClass?.max_capacity || "--"}
                  readOnly
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-[#F7EFE8] px-5 py-4 text-[#6F5645] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Ubicación / Sala
                </label>

                <select
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar sala</option>

                  {rooms.map((room) => (
                    <option key={room.id} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/schedules")}
              className="rounded-[14px] border border-[#E8DDD3] px-8 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-[14px] bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90"
            >
              Crear horario
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}