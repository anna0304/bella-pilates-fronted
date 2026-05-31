import { useEffect, useState } from "react";

import { getAdminClasses } from "../../../services/adminClassesService";
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

export function EditScheduleModal({ schedule, onClose, onSave }) {
  const [form, setForm] = useState(null);
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setForm(schedule);
  }, [schedule]);

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

    if (schedule) {
      loadData();
    }
  }, [schedule]);

  if (!schedule || !form) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "classId") {
      const selectedClass = classes.find((item) => item.id === Number(value));

      setForm((currentForm) => ({
        ...currentForm,
        classId: Number(value),
        className: selectedClass?.title || currentForm.className,
        capacity: selectedClass?.max_capacity || currentForm.capacity,
      }));

      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#2F2118]">
            Editar horario
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Clase
              </label>

              <select
                name="classId"
                value={form.classId || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                <option value="">Seleccionar clase</option>

                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Instructor
              </label>

              <select
                name="instructor"
                value={form.instructor || ""}
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
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Día
              </label>

              <select
                name="dayOfWeek"
                value={form.dayOfWeek || ""}
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
                Hora inicio
              </label>

              <input
                name="startTime"
                type="time"
                value={form.startTime || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Hora fin
              </label>

              <input
                name="endTime"
                type="time"
                value={form.endTime || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Capacidad
              </label>

              <input
                name="capacity"
                type="number"
                value={form.capacity || ""}
                readOnly
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-[#F7EFE8] px-5 py-4 text-[#6F5645] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Sala
              </label>

              <select
                name="room"
                value={form.room || ""}
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

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Estado
              </label>

              <select
                name="status"
                value={form.status || "Programado"}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                <option>Programado</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Notas
            </label>

            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              rows={5}
              className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}