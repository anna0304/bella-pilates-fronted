import { useEffect, useMemo, useState } from "react";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { RecordedClassCard } from "../../../components/user/recordedClasses/RecordedClassCard";
import { RecordedClassFilters } from "../../../components/user/recordedClasses/RecordedClassFilters";
import { Toast } from "../../../components/ui/Toast";
import { LoadingPage } from "../../../components/ui/LoadingPage";
import { ErrorState } from "../../../components/ui/ErrorState";

import { getRecordedClasses } from "../../../services/userRecordedClassesService";

import thumbnail from "../../../assets/dashboard-hero.jpg";

function getData(response) {
  return response.data || response.recordedClasses || response || [];
}

function getImageUrl(image) {
  if (!image) return thumbnail;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function formatDuration(duration) {
  if (!duration) return "—";

  const minutes = Number(duration);

  if (Number.isNaN(minutes)) {
    return duration;
  }

  return `${minutes}:00`;
}

function formatLevel(level) {
  const levels = {
    beginner: "Nivel Principiante",
    intermediate: "Nivel Intermedio",
    advanced: "Nivel Avanzado",
  };

  return levels[level] || level || "Nivel no definido";
}

function mapRecordedClass(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description || "Clase grabada disponible.",
    thumbnail: getImageUrl(item.thumbnail || item.class?.image),
    duration: formatDuration(item.duration),
    teacher: item.class?.instructor_name || "Instructor por confirmar",
    level: formatLevel(item.level),
    category: item.class?.category || "Clase",
    date: item.created_at,
    videoUrl: item.video_url,
    raw: item,
  };
}

export function RecordedClassesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [recordedClasses, setRecordedClasses] = useState([]);
  const [loadingRecordedClasses, setLoadingRecordedClasses] = useState(true);
  const [errorRecordedClasses, setErrorRecordedClasses] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({
      visible: true,
      message,
    });

    setTimeout(() => {
      setToast({
        visible: false,
        message: "",
      });
    }, 1800);
  };

  async function loadRecordedClasses() {
    try {
      setLoadingRecordedClasses(true);
      setErrorRecordedClasses(false);

      const response = await getRecordedClasses();
      const data = getData(response);

      setRecordedClasses(data.map(mapRecordedClass));
    } catch (error) {
      console.error("Error al cargar clases grabadas:", error);
      setErrorRecordedClasses(true);
      showToast("Error al cargar clases grabadas");
    } finally {
      setLoadingRecordedClasses(false);
    }
  }

  useEffect(() => {
    loadRecordedClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    let data = [...recordedClasses];

    data = data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );

    if (selectedLevel) {
      data = data.filter((item) => item.level === selectedLevel);
    }

    if (selectedType) {
      data = data.filter((item) => item.category === selectedType);
    }

    if (selectedDuration) {
      data = data.filter((item) => {
        const minutes = Number(String(item.duration).split(":")[0]);

        if (selectedDuration === "short") return minutes <= 25;
        if (selectedDuration === "medium") return minutes > 25 && minutes <= 35;
        if (selectedDuration === "long") return minutes > 35;

        return true;
      });
    }

    data.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);

      return sortBy === "recent" ? bDate - aDate : aDate - bDate;
    });

    return data;
  }, [
    recordedClasses,
    search,
    selectedLevel,
    selectedType,
    selectedDuration,
    sortBy,
  ]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
      <Toast visible={toast.visible} message={toast.message} />

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-[260px] max-w-[85vw]">
            <DashboardSidebar />
          </div>
        </div>
      )}

      <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
        <div className="p-5 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl text-white lg:hidden"
            >
              ☰
            </button>

            <DashboardHeader />
          </div>

          <section>
            <div className="mb-8">
              <h1 className="text-4xl font-semibold text-[#2F2118]">
                Clases grabadas
              </h1>

              <p className="mt-2 text-[#6F5645]">
                Accede a todas las clases grabadas y entrena desde casa.
              </p>
            </div>

            <RecordedClassFilters
              search={search}
              onSearchChange={setSearch}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {loadingRecordedClasses ? (
              <LoadingPage text="Cargando clases grabadas..." />
            ) : errorRecordedClasses ? (
              <ErrorState
                title="No pudimos cargar las clases grabadas"
                message="Inténtalo de nuevo dentro de unos minutos."
                actionText="Reintentar"
                onAction={loadRecordedClasses}
              />
            ) : filteredClasses.length === 0 ? (
              <div className="rounded-[22px] border border-[#E8DDD3] bg-secondary px-6 py-12 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-[#2F2118]">
                  No hay clases grabadas disponibles
                </h2>

                <p className="mt-2 text-sm text-[#6F5645]">
                  Cuando el centro suba nuevas clases, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredClasses.map((video) => (
                  <RecordedClassCard
                    key={video.id}
                    video={video}
                    onAddFavorite={showToast}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}