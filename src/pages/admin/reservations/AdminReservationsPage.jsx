import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { ReservationStatsCards } from "./ReservationStatsCards";
import { ReservationFilters } from "./ReservationFilters";
import { ReservationRow, LevelBadge, StatusBadge } from "./ReservationRow";
import { ViewReservationModal } from "./ViewReservationModal";

import {
  getAdminReservations,
  updateAdminReservationStatus,
} from "../../../services/adminReservationsService";

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

const levelLabels = {
  beginner: "Nivel Principiante",
  intermediate: "Nivel Intermedio",
  advanced: "Nivel Avanzado",
};

const statusLabels = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  no_show: "No asistió",
};

const statusToApi = {
  Confirmada: "confirmed",
  Cancelada: "cancelled",
  Completada: "completed",
  "No asistió": "no_show",
};

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value) {
  return value ? value.slice(0, 5) : "—";
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

function mapReservationFromApi(reservation) {
  const user = reservation.user || {};
  const schedule = reservation.schedule || {};
  const classData = schedule.class || {};

  return {
    id: reservation.id,
    userName:
      [user.name, user.surname].filter(Boolean).join(" ") || "Sin usuario",
    userEmail: user.email || "Sin email",
    className: classData.title || "Clase sin nombre",
    level: levelLabels[classData.level] || "Sin nivel",
    instructor:
      schedule.instructor_name || classData.instructor_name || "Sin instructor",
    date: formatDate(schedule.created_at),
    day: dayLabels[schedule.day_of_week] || schedule.day_of_week || "—",
    time: formatTime(schedule.start_time),
    duration: getDuration(
      schedule.start_time,
      schedule.end_time,
      classData.duration,
    ),
    status: statusLabels[reservation.status] || reservation.status,
    reservationDate: formatDate(reservation.created_at),
    reservationTime: formatTime(reservation.created_at?.slice(11, 19)),
    notes: reservation.notes || "",
    raw: reservation,
  };
}

export function AdminReservationsPage() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [instructorFilter, setInstructorFilter] = useState("Todos");

  const [viewingReservation, setViewingReservation] = useState(null);

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

  async function loadReservations() {
    try {
      setLoadingReservations(true);

      const response = await getAdminReservations();
      const data = response.data || response.reservations || response || [];

      setReservations(data.map(mapReservationFromApi));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar reservas");
    } finally {
      setLoadingReservations(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  const classOptions = useMemo(() => {
    return [
      "Todas",
      ...new Set(reservations.map((item) => item.className).filter(Boolean)),
    ];
  }, [reservations]);

  const statusOptions = useMemo(() => {
    return [
      "Todos",
      ...new Set(reservations.map((item) => item.status).filter(Boolean)),
    ];
  }, [reservations]);

  const instructorOptions = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        reservations
          .map((item) => item.instructor)
          .filter(
            (instructor) => instructor && instructor !== "Sin instructor",
          ),
      ),
    ];
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        reservation.userName.toLowerCase().includes(searchValue) ||
        reservation.userEmail.toLowerCase().includes(searchValue) ||
        reservation.className.toLowerCase().includes(searchValue);

      const matchesClass =
        classFilter === "Todas" || reservation.className === classFilter;

      const matchesStatus =
        statusFilter === "Todos" || reservation.status === statusFilter;

      const matchesInstructor =
        instructorFilter === "Todos" ||
        reservation.instructor === instructorFilter;

      return (
        matchesSearch && matchesClass && matchesStatus && matchesInstructor
      );
    });
  }, [reservations, search, classFilter, statusFilter, instructorFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReservations.length / ITEMS_PER_PAGE),
  );

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReservations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReservations, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, classFilter, statusFilter, instructorFilter]);

  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reservas - Bella Pilates", 14, 18);

    doc.setFontSize(10);
    doc.text(`Total exportado: ${filteredReservations.length}`, 14, 26);

    autoTable(doc, {
      startY: 34,
      head: [
        [
          "Usuario",
          "Email",
          "Clase",
          "Instructor",
          "Día",
          "Hora",
          "Estado",
          "Fecha reserva",
        ],
      ],
      body: filteredReservations.map((reservation) => [
        reservation.userName,
        reservation.userEmail,
        reservation.className,
        reservation.instructor,
        reservation.day,
        reservation.time,
        reservation.status,
        `${reservation.reservationDate} ${reservation.reservationTime}`,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [143, 91, 63],
      },
    });

    doc.save("reservas-bella-pilates.pdf");
    showToast("PDF exportado correctamente");
  };

  const handleChangeStatus = async (reservationId, newStatus) => {
    try {
      await updateAdminReservationStatus(
        reservationId,
        statusToApi[newStatus] || newStatus,
      );

      showToast("Estado de la reserva actualizado");
      await loadReservations();
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
            <h1 className="text-4xl font-semibold text-[#2F2118]">Reservas</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona todas las reservas de los usuarios.
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
              onClick={() => navigate("/admin/reservations/new")}
              className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              + Nueva reserva
            </button>
          </div>
        </div>

        <ReservationStatsCards reservations={reservations} />

        <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
          <ReservationFilters
            search={search}
            setSearch={setSearch}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            instructorFilter={instructorFilter}
            setInstructorFilter={setInstructorFilter}
            classOptions={classOptions}
            statusOptions={statusOptions}
            instructorOptions={instructorOptions}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            {loadingReservations ? (
              <EmptyState text="Cargando reservas..." />
            ) : paginatedReservations.length === 0 ? (
              <EmptyState text="No hay reservas para mostrar." />
            ) : (
              paginatedReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onView={() => setViewingReservation(reservation)}
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
                  <th className="px-4 py-4 font-semibold">Clase</th>
                  <th className="px-4 py-4 font-semibold">Instructor</th>
                  <th className="px-4 py-4 font-semibold">Día</th>
                  <th className="px-4 py-4 font-semibold">Hora</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="px-4 py-4 font-semibold">Reserva</th>
                  <th className="rounded-r-[14px] px-4 py-4 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DDD3]">
                {loadingReservations ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      Cargando reservas...
                    </td>
                  </tr>
                ) : paginatedReservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      No hay reservas para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginatedReservations.map((reservation) => (
                    <ReservationRow
                      key={reservation.id}
                      reservation={reservation}
                      onView={() => setViewingReservation(reservation)}
                      onChangeStatus={handleChangeStatus}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
            <p>
              Mostrando {paginatedReservations.length} de{" "}
              {filteredReservations.length} reservas
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

      <ViewReservationModal
        reservation={viewingReservation}
        onClose={() => setViewingReservation(null)}
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

function ReservationCard({ reservation, onView, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStatusChange = (status) => {
    onChangeStatus(reservation.id, status);
    setIsMenuOpen(false);
  };

  return (
    <article className="rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-[#2F2118]">
            {reservation.userName}
          </h3>

          <p className="mt-1 break-words text-sm text-[#6F5645]">
            {reservation.userEmail}
          </p>
        </div>

        <StatusBadge status={reservation.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Clase" value={reservation.className} />
        <Info label="Instructor" value={reservation.instructor} />
        <Info label="Día" value={reservation.day} />
        <Info
          label="Hora"
          value={reservation.time}
          subValue={reservation.duration}
        />
        <Info
          label="Fecha reserva"
          value={reservation.reservationDate}
          subValue={reservation.reservationTime}
        />

        <div>
          <p className="text-xs font-medium text-[#8B6B52]">Nivel</p>
          <div className="mt-1">
            <LevelBadge level={reservation.level} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 font-semibold text-primary transition hover:bg-[#FCF8F5]"
        >
          Ver
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 text-xl font-semibold text-primary transition hover:bg-[#FCF8F5]"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-12 right-0 z-50 w-[220px] rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl">
              {["Confirmada", "Cancelada", "Completada", "No asistió"].map(
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

function Info({ label, value, subValue }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#2F2118]">
        {value || "—"}
      </p>
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