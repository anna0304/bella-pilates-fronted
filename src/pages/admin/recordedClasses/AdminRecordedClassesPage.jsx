import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { RecordedClassStatsCards } from "./RecordedClassStatsCards";
import { RecordedClassFilters } from "./RecordedClassFilters";
import { RecordedClassRow } from "./RecordedClassRow";
import { ViewRecordedClassModal } from "./ViewRecordedClassModal";
import { EditRecordedClassModal } from "./EditRecordedClassModal";

import {
  deactivateAdminRecordedClass,
  getAdminRecordedClasses,
  updateAdminRecordedClass,
} from "../../../services/adminRecordedClassesService";

import fallbackImage from "../../../assets/dashboard-hero.jpg";

const ITEMS_PER_PAGE =5;

const levelLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const levelToApi = {
  Principiante: "beginner",
  Intermedio: "intermediate",
  Avanzado: "advanced",
};

const categoryLabels = {
  reformer: "Reformer",
  mat: "Mat",
  flow: "Flow",
  yoga: "Yoga",
  stretching: "Stretching",
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
  return value ? value.slice(11, 16) : "";
}

function getData(response) {
  return response.data || response.recordedClasses || response || [];
}

function mapRecordedClassFromApi(item) {
  const classData = item.class || {};

  return {
    id: item.id,
    classId: item.class_id,
    title: item.title || "",
    description: item.description || "",
    category:
      categoryLabels[classData.category] ||
      categoryLabels[item.category] ||
      classData.category ||
      item.category ||
      "Sin categoría",
    className: classData.title || "Clase sin nombre",
    instructor:
      classData.instructor_name ||
      item.instructor_name ||
      item.instructor ||
      "Sin instructor",
    level: levelLabels[item.level] || item.level || "Sin nivel",
    duration: item.duration ? `${item.duration} min` : "—",
    durationNumber: item.duration || 0,
    views: item.views || 0,
    status: item.is_active ? "Publicada" : "Archivada",
    publishDate: item.is_active ? formatDate(item.created_at) : "—",
    publishTime: item.is_active ? formatTime(item.created_at) : "",
    thumbnail: item.thumbnail || fallbackImage,
    videoUrl: item.video_url || "",
    featured: Boolean(item.featured),
    raw: item,
  };
}

function buildPayload(video, isActive = video.status === "Publicada") {
  return {
    class_id: video.classId,
    title: video.title,
    description: video.description || "",
    video_url: video.videoUrl,
    thumbnail: video.thumbnail || null,
    duration: Number(
      video.durationNumber || String(video.duration).replace("min", "").trim(),
    ),
    level: levelToApi[video.level] || video.raw?.level || video.level,
    featured: Boolean(video.featured),
    is_active: isActive,
  };
}

export function AdminRecordedClassesPage() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [activeTab, setActiveTab] = useState("Todas");

  const [viewingVideo, setViewingVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadRecordedClasses() {
    try {
      setLoadingVideos(true);

      const response = await getAdminRecordedClasses();
      const data = getData(response);

      setVideos(data.map(mapRecordedClassFromApi));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar clases grabadas");
    } finally {
      setLoadingVideos(false);
    }
  }

  useEffect(() => {
    loadRecordedClasses();
  }, []);

  const categoryOptions = useMemo(() => {
    return [
      "Todas",
      ...new Set(videos.map((video) => video.category).filter(Boolean)),
    ];
  }, [videos]);

  const levelOptions = useMemo(() => {
    return [
      "Todos",
      ...new Set(videos.map((video) => video.level).filter(Boolean)),
    ];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        video.title.toLowerCase().includes(searchValue) ||
        video.className.toLowerCase().includes(searchValue) ||
        video.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "Todas" || video.category === categoryFilter;

      const matchesLevel =
        levelFilter === "Todos" || video.level === levelFilter;

      const matchesTab =
        activeTab === "Todas" ||
        (activeTab === "Publicadas" && video.status === "Publicada") ||
        (activeTab === "Archivadas" && video.status === "Archivada") ||
        (activeTab === "Destacadas" && video.featured);

      return matchesSearch && matchesCategory && matchesLevel && matchesTab;
    });
  }, [videos, search, categoryFilter, levelFilter, activeTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVideos.length / ITEMS_PER_PAGE),
  );

  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, levelFilter, activeTab]);

  const handleEditVideo = async (updatedVideo) => {
    try {
      await updateAdminRecordedClass(
        updatedVideo.id,
        buildPayload(updatedVideo),
      );

      setEditingVideo(null);
      showToast("Clase grabada actualizada correctamente");
      await loadRecordedClasses();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar clase grabada");
    }
  };

  const handleChangeStatus = async (videoId, newStatus) => {
    try {
      const video = videos.find((item) => item.id === videoId);

      if (!video) return;

      if (newStatus === "Archivada") {
        await deactivateAdminRecordedClass(videoId);
      } else {
        await updateAdminRecordedClass(
          videoId,
          buildPayload({ ...video, status: newStatus }, true),
        );
      }

      showToast("Estado actualizado correctamente");
      await loadRecordedClasses();
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
            <h1 className="text-4xl font-semibold text-[#2F2118]">
              Clases grabadas
            </h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona y organiza todas las clases grabadas disponibles para los
              usuarios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/recorded-classes/new")}
            className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            + Subir clase grabada
          </button>
        </div>

        <RecordedClassStatsCards videos={videos} />

        <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
          <RecordedClassFilters
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            categoryOptions={categoryOptions}
            levelOptions={levelOptions}
          />

          <div className="mt-7 overflow-x-auto border-b border-[#E8DDD3]">
            <div className="flex min-w-max gap-8">
              {["Todas", "Publicadas", "Archivadas", "Destacadas"].map(
                (tab) => (
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
                    {tab} ({getTabCount(tab, videos)})
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:hidden">
            {loadingVideos ? (
              <EmptyState text="Cargando clases grabadas..." />
            ) : paginatedVideos.length === 0 ? (
              <EmptyState text="No hay clases grabadas para mostrar." />
            ) : (
              paginatedVideos.map((video) => (
                <RecordedClassCard
                  key={video.id}
                  video={video}
                  onView={() => setViewingVideo(video)}
                  onEdit={() => setEditingVideo(video)}
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
                    Clase
                  </th>
                  <th className="px-4 py-4 font-semibold">Categoría</th>
                  <th className="px-4 py-4 font-semibold">Instructor</th>
                  <th className="px-4 py-4 font-semibold">Nivel</th>
                  <th className="px-4 py-4 font-semibold">Duración</th>
                  <th className="px-4 py-4 font-semibold">Publicación</th>
                  <th className="w-[170px] rounded-r-[14px] px-4 py-4 text-center font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DDD3]">
                {loadingVideos ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      Cargando clases grabadas...
                    </td>
                  </tr>
                ) : paginatedVideos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      No hay clases grabadas para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginatedVideos.map((video) => (
                    <RecordedClassRow
                      key={video.id}
                      video={video}
                      onView={() => setViewingVideo(video)}
                      onEdit={() => setEditingVideo(video)}
                      onChangeStatus={handleChangeStatus}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
            <p>
              Mostrando {paginatedVideos.length} de {filteredVideos.length}{" "}
              clases grabadas
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

      <ViewRecordedClassModal
        video={viewingVideo}
        onClose={() => setViewingVideo(null)}
        onEdit={(video) => {
          setViewingVideo(null);
          setEditingVideo(video);
        }}
      />

      <EditRecordedClassModal
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={handleEditVideo}
      />
    </AdminLayout>
  );
}

function getTabCount(tab, videos) {
  if (tab === "Todas") return videos.length;

  if (tab === "Publicadas") {
    return videos.filter((video) => video.status === "Publicada").length;
  }

  if (tab === "Archivadas") {
    return videos.filter((video) => video.status === "Archivada").length;
  }

  if (tab === "Destacadas") {
    return videos.filter((video) => video.featured).length;
  }

  return 0;
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[18px] border border-[#E8DDD3] bg-white px-5 py-10 text-center text-[#6F5645]">
      {text}
    </div>
  );
}

function RecordedClassCard({ video, onView, onEdit, onChangeStatus }) {
  return (
    <article className="rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-20 w-28 rounded-[16px] object-cover"
          />

          <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            {video.duration}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-lg font-semibold text-[#2F2118]">
            {video.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-[#6F5645]">
            {video.description}
          </p>

          {video.featured && (
            <div className="mt-3">
              <span className="rounded-full bg-[#F8EADF] px-4 py-1 text-xs font-semibold text-primary">
                Destacada
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Clase" value={video.className} />
        <Info label="Instructor" value={video.instructor} />
        <Info label="Categoría" value={video.category} />
        <Info label="Nivel" value={video.level} />
        <Info
          label="Publicación"
          value={video.publishDate}
          subValue={video.publishTime}
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
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

        <button
          type="button"
          onClick={() =>
            onChangeStatus(
              video.id,
              video.status === "Publicada" ? "Archivada" : "Publicada",
            )
          }
          className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 font-semibold text-[#5A4030] transition hover:bg-[#FCF8F5]"
        >
          {video.status === "Publicada" ? "Archivar" : "Publicar"}
        </button>
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