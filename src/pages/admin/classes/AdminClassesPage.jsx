import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { ClassStatusCards } from "./ClassStatusCards";
import { ClassFilters } from "./ClassFilters";
import { ClassRow } from "./ClassRow";
import { ViewClassModal } from "./ViewClassModal";
import { EditClassModal } from "./EditClassModal";

import {
  activateAdminClass,
  deactivateAdminClass,
  getAdminClasses,
  updateAdminClass,
} from "../../../services/adminClassesService";

import { getAdminUsers } from "../../../services/adminUsersService";

import fallbackImage from "../../../assets/dashboard-hero.jpg";

const ITEMS_PER_PAGE = 5;

const categoryLabels = {
  reformer: "Reformer",
  mat: "Mat",
  flow: "Flow",
  yoga: "Yoga",
  stretching: "Stretching",
};

const levelLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

function mapClassFromApi(item) {
  return {
    id: item.id,
    name: item.title || "",
    category: categoryLabels[item.category] || item.category || "Sin categoría",
    level: levelLabels[item.level] || item.level || "Sin nivel",
    instructor:
      item.instructor?.name || item.instructor_name || "Sin instructor",
    duration: item.duration ? `${item.duration} min` : "—",
    status: item.is_active ? "Activa" : "Inactiva",
    description: item.description || "",
    image: item.image || fallbackImage,
    maxCapacity: item.max_capacity || 0,
    raw: item,
  };
}

function mapCategoryToApi(category) {
  const map = {
    Reformer: "reformer",
    Mat: "mat",
    Flow: "flow",
    Yoga: "yoga",
    Stretching: "stretching",
  };

  return map[category] || category;
}

function mapLevelToApi(level) {
  const map = {
    Principiante: "beginner",
    Intermedio: "intermediate",
    Avanzado: "advanced",
  };

  return map[level] || level;
}

function getDurationNumber(duration) {
  return Number(String(duration).replace("min", "").trim()) || 0;
}

export function AdminClassesPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [viewingClass, setViewingClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);

  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadClasses() {
    try {
      setLoadingClasses(true);

      const [classesResponse, usersResponse] = await Promise.all([
        getAdminClasses(),
        getAdminUsers(),
      ]);

      const data =
        classesResponse.data ||
        classesResponse.classes ||
        classesResponse ||
        [];

      const usersData =
        usersResponse.data || usersResponse.users || usersResponse || [];

      setClasses(data.map(mapClassFromApi));

      const instructorNames = usersData
        .filter((user) => user.role === "instructor")
        .map((user) =>
          [user.name, user.surname].filter(Boolean).join(" ").trim(),
        )
        .filter(Boolean);

      setInstructors([...new Set(instructorNames)]);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar clases");
    } finally {
      setLoadingClasses(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const categoryOptions = useMemo(() => {
    return [
      "Todas",
      ...new Set(classes.map((item) => item.category).filter(Boolean)),
    ];
  }, [classes]);

  const levelOptions = useMemo(() => {
    return [
      "Todos",
      ...new Set(classes.map((item) => item.level).filter(Boolean)),
    ];
  }, [classes]);

  const statusOptions = ["Todos", "Activa", "Inactiva"];

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchValue) ||
        item.instructor.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "Todas" || item.category === categoryFilter;

      const matchesLevel =
        levelFilter === "Todos" || item.level === levelFilter;

      const matchesStatus =
        statusFilter === "Todos" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [classes, search, categoryFilter, levelFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / ITEMS_PER_PAGE),
  );

  const paginatedClasses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClasses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClasses, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, levelFilter, statusFilter]);

  const buildPayload = (item, isActive = item.status === "Activa") => {
    const formData = new FormData();

    formData.append("title", item.name);
    formData.append("description", item.description || "");
    formData.append("category", mapCategoryToApi(item.category));
    formData.append("level", mapLevelToApi(item.level));
    formData.append("duration", getDurationNumber(item.duration));
    formData.append(
      "max_capacity",
      Number(item.maxCapacity || item.raw?.max_capacity || 0),
    );
    formData.append(
      "instructor_name",
      item.instructor === "Sin instructor" ? "" : item.instructor || "",
    );
    formData.append("is_active", isActive ? "1" : "0");

    if (item.image instanceof File) {
      formData.append("image", item.image);
    }

    return formData;
  };

  const handleToggleStatus = async (classItem) => {
    try {
      if (classItem.status === "Activa") {
        await deactivateAdminClass(classItem.id);
        showToast("Clase desactivada correctamente");
      } else {
        await activateAdminClass(classItem.id);
        showToast("Clase activada correctamente");
      }

      await loadClasses();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar estado");
    }
  };

  const handleEditClass = async (updatedClass) => {
    try {
      await updateAdminClass(updatedClass.id, buildPayload(updatedClass));

      setEditingClass(null);
      showToast("Clase actualizada correctamente");
      await loadClasses();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar clase");
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">Clases</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona las clases disponibles del centro.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/classes/new")}
            className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            + Nueva clase
          </button>
        </div>

        <ClassStatusCards classes={classes} />

        <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
          <ClassFilters
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryOptions={categoryOptions}
            levelOptions={levelOptions}
            statusOptions={statusOptions}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            {loadingClasses ? (
              <EmptyState text="Cargando clases..." />
            ) : paginatedClasses.length === 0 ? (
              <EmptyState text="No hay clases para mostrar." />
            ) : (
              paginatedClasses.map((item) => (
                <ClassCard
                  key={item.id}
                  classItem={item}
                  onView={() => setViewingClass(item)}
                  onEdit={() => setEditingClass(item)}
                  onToggleStatus={() => handleToggleStatus(item)}
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
                  <th className="px-4 py-4 font-semibold">Categoría</th>
                  <th className="px-4 py-4 font-semibold">Instructor</th>
                  <th className="px-4 py-4 font-semibold">Nivel</th>
                  <th className="px-4 py-4 font-semibold">Duración</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="rounded-r-[14px] px-4 py-4 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DDD3]">
                {loadingClasses ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      Cargando clases...
                    </td>
                  </tr>
                ) : paginatedClasses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      No hay clases para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginatedClasses.map((item) => (
                    <ClassRow
                      key={item.id}
                      classItem={item}
                      onView={() => setViewingClass(item)}
                      onEdit={() => setEditingClass(item)}
                      onToggleStatus={() => handleToggleStatus(item)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
            <p>
              Mostrando {paginatedClasses.length} de {filteredClasses.length}{" "}
              clases
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

      <ViewClassModal
        classItem={viewingClass}
        onClose={() => setViewingClass(null)}
        onEdit={(item) => {
          setViewingClass(null);
          setEditingClass(item);
        }}
      />

      <EditClassModal
        classItem={editingClass}
        onClose={() => setEditingClass(null)}
        onSave={handleEditClass}
        categoryOptions={categoryOptions}
        levelOptions={levelOptions}
        instructorOptions={instructors}
        statusOptions={statusOptions}
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

function ClassCard({ classItem, onView, onEdit, onToggleStatus }) {
  const isActive = classItem.status === "Activa";

  return (
    <article className="rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <img
          src={classItem.image}
          alt={classItem.name}
          className="h-20 w-24 shrink-0 rounded-[16px] object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-lg font-semibold text-[#2F2118]">
            {classItem.name}
          </h3>

          <p className="mt-1 text-sm text-[#6F5645]">{classItem.category}</p>

          <button
            type="button"
            onClick={onToggleStatus}
            className={`mt-3 rounded-full px-4 py-1 text-xs font-semibold ${
              isActive
                ? "bg-[#E8F6EC] text-[#1F8A4C]"
                : "bg-[#FDECEC] text-[#D64545]"
            }`}
          >
            {classItem.status}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Instructor" value={classItem.instructor} />
        <Info label="Nivel" value={classItem.level} />
        <Info label="Duración" value={classItem.duration} />
        <Info label="Capacidad" value={classItem.maxCapacity} />
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

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#2F2118]">
        {value || "—"}
      </p>
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
