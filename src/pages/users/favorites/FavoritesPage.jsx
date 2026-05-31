import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";
import { LoadingPage } from "../../../components/ui/LoadingPage";
import { ErrorState } from "../../../components/ui/ErrorState";

import {
  getMyFavorites,
  removeFavorite,
} from "../../../services/userFavoritesService";

import thumbnail from "../../../assets/dashboard-hero.jpg";
import heartIcon from "../../../assets/heartfull.svg";

function getData(response) {
  return response.data || response.favorites || response || [];
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

  return `${minutes} min`;
}

function formatLevel(level) {
  const levels = {
    beginner: "Nivel Principiante",
    intermediate: "Nivel Intermedio",
    advanced: "Nivel Avanzado",
  };

  return levels[level] || level || "Nivel no definido";
}

function formatDate(value) {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function mapFavorite(favorite) {
  const recordedClass = favorite.recorded_class || favorite.recordedClass;
  const classData = recordedClass?.class;

  return {
    id: favorite.id,
    recordedClassId: recordedClass?.id,
    title: recordedClass?.title || "Clase grabada",
    teacher: classData?.instructor_name || "Instructor por confirmar",
    level: formatLevel(recordedClass?.level),
    category: classData?.category || "Clase",
    description: recordedClass?.description || "Clase guardada en favoritos.",
    duration: formatDuration(recordedClass?.duration),
    date: formatDate(favorite.created_at),
    thumbnail: getImageUrl(recordedClass?.thumbnail || classData?.image),
  };
}

export function FavoritesPage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [errorFavorites, setErrorFavorites] = useState(false);
  const [removingId, setRemovingId] = useState(null);

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

  async function loadFavorites() {
    try {
      setLoadingFavorites(true);
      setErrorFavorites(false);

      const response = await getMyFavorites();
      const data = getData(response);

      setFavorites(data.map(mapFavorite));
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setErrorFavorites(true);
      showToast("Error al cargar favoritos");
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (recordedClassId) => {
    try {
      setRemovingId(recordedClassId);

      await removeFavorite(recordedClassId);

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (item) => String(item.recordedClassId) !== String(recordedClassId),
        ),
      );

      showToast("Clase eliminada de favoritos");
    } catch (error) {
      console.error("Error al eliminar favorito:", error);

      const message =
        error?.response?.data?.message || "No se pudo eliminar el favorito";

      showToast(message);
    } finally {
      setRemovingId(null);
    }
  };

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
                Mis favoritos
              </h1>

              <p className="mt-2 text-[#6F5645]">
                Aquí encontrarás todas las clases que guardaste para volver a
                practicar cuando quieras.
              </p>
            </div>

            {loadingFavorites ? (
              <LoadingPage text="Cargando favoritos..." />
            ) : errorFavorites ? (
              <ErrorState
                title="No pudimos cargar tus favoritos"
                message="Inténtalo de nuevo dentro de unos minutos."
                actionText="Reintentar"
                onAction={loadFavorites}
              />
            ) : favorites.length === 0 ? (
              <div className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-[#2F2118]">
                  Aún no tienes favoritos
                </h2>

                <p className="mx-auto mt-3 max-w-md text-[#6F5645]">
                  Guarda clases grabadas para encontrarlas rápidamente aquí.
                </p>

                <Button2
                  variant="primary"
                  className="mt-6"
                  onClick={() => navigate("/recorded-classes")}
                >
                  Explorar clases
                </Button2>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {favorites.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-5 rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-sm transition hover:shadow-md lg:grid-cols-[250px_1fr_auto]"
                  >
                    <div
                      onClick={() =>
                        navigate(`/recorded-classes/${item.recordedClassId}`)
                      }
                      className="relative cursor-pointer overflow-hidden rounded-[18px]"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-[150px] w-full object-cover"
                      />

                      <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                        {item.duration}
                      </span>
                    </div>

                    <div>
                      <h2
                        onClick={() =>
                          navigate(`/recorded-classes/${item.recordedClassId}`)
                        }
                        className="cursor-pointer text-xl font-semibold text-[#2F2118] hover:text-primary"
                      >
                        {item.title}
                      </h2>

                      <p className="mt-2 text-sm text-[#6F5645]">
                        {item.teacher}
                        <span className="mx-2">•</span>
                        {item.level}
                        <span className="mx-2">•</span>
                        {item.category}
                      </p>

                      <p className="mt-4 max-w-3xl leading-relaxed text-[#6F5645]">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-start justify-between gap-5 lg:flex-col lg:items-end">
                      <span className="text-sm text-[#6F5645]">
                        {item.date}
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full">
                        <img
                          src={heartIcon}
                          alt="Favorito"
                          className="h-6 w-6"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={removingId === item.recordedClassId}
                        onClick={() =>
                          handleRemoveFavorite(item.recordedClassId)
                        }
                        className="text-sm font-semibold text-primary transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removingId === item.recordedClassId
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </article>
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