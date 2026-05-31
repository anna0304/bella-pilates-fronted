import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";

import {
  getRecordedClass,
  getRecordedClasses,
} from "../../../services/userRecordedClassesService";

import thumbnail from "../../../assets/dashboard-hero.jpg";

import clockIcon from "../../../assets/reloj.svg";
import profileIcon from "../../../assets/perfil.svg";

function getData(response) {
  return response.data || response.recordedClass || response || null;
}

function getListData(response) {
  return response.data || response.recordedClasses || response || [];
}

function getImageUrl(image) {
  if (!image) return thumbnail;
  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

function getVideoData(videoUrl) {
  if (!videoUrl) {
    return {
      type: "empty",
      url: "",
    };
  }

  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = new URL(videoUrl).searchParams.get("v");

    return {
      type: "youtube",
      url: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];

    return {
      type: "youtube",
      url: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (videoUrl.startsWith("http")) {
    return {
      type: "video",
      url: videoUrl,
    };
  }

  return {
    type: "video",
    url: `http://localhost:8000/storage/${videoUrl}`,
  };
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
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return levels[level] || level || "Nivel no definido";
}

function mapRecordedClass(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description || "Clase grabada disponible.",
    thumbnail: getImageUrl(item.thumbnail || item.class?.image),
    video: getVideoData(item.video_url),
    duration: formatDuration(item.duration),
    teacher: item.class?.instructor_name || "Instructor por confirmar",
    level: formatLevel(item.level),
    category: item.class?.category || "Clase",
    raw: item,
  };
}

export function RecordedClassDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const carouselRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [recommendedClasses, setRecommendedClasses] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(true);

  useEffect(() => {
    async function loadRecordedClassDetail() {
      try {
        setLoadingVideo(true);

        const [detailResponse, listResponse] = await Promise.all([
          getRecordedClass(id),
          getRecordedClasses(),
        ]);

        const detailData = getData(detailResponse);
        const listData = getListData(listResponse);

        if (!detailData) {
          setVideo(null);
          setRecommendedClasses([]);
          return;
        }

        setVideo(mapRecordedClass(detailData));

        setRecommendedClasses(
          listData
            .filter((item) => String(item.id) !== String(id))
            .map(mapRecordedClass),
        );
      } catch (error) {
        console.error("Error al cargar clase grabada:", error);
        setVideo(null);
        setRecommendedClasses([]);
      } finally {
        setLoadingVideo(false);
      }
    }

    loadRecordedClassDetail();
  }, [id]);

  const handleNextRecommended = () => {
    carouselRef.current?.scrollBy({
      left: 720,
      behavior: "smooth",
    });
  };

  const handlePrevRecommended = () => {
    carouselRef.current?.scrollBy({
      left: -540,
      behavior: "smooth",
    });
  };

  if (loadingVideo) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
        <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
          <DashboardSidebar />
        </div>

        <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
          <div className="p-5 lg:p-8">
            <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
              <p className="text-[#6F5645]">Cargando clase grabada...</p>
            </section>
          </div>

          <DashboardFooter />
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
        <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
          <DashboardSidebar />
        </div>

        <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
          <div className="p-5 lg:p-8">
            <Button2
              variant="outline"
              className="mb-8"
              onClick={() => navigate("/recorded-classes")}
            >
              ← Volver
            </Button2>

            <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 text-center shadow-sm">
              <h1 className="text-3xl font-semibold text-[#2F2118]">
                Clase grabada no encontrada
              </h1>

              <p className="mt-3 text-[#6F5645]">
                No hemos podido encontrar esta clase grabada.
              </p>
            </section>
          </div>

          <DashboardFooter />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
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
            <Button2
              variant="outline"
              className="mb-8"
              onClick={() => navigate("/recorded-classes")}
            >
              ← Volver
            </Button2>

            <div className="mx-auto flex w-full max-w-[1200px] flex-col overflow-hidden rounded-[28px] border border-[#E8DDD3] bg-secondary shadow-sm">
              {video.video?.type === "youtube" ? (
                <iframe
                  src={video.video.url}
                  title={video.title}
                  className="h-[500px] w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : video.video?.type === "video" ? (
                <video
                  controls
                  className="h-[500px] w-full object-cover"
                  poster={video.thumbnail}
                >
                  <source src={video.video.url} type="video/mp4" />
                  Tu navegador no puede reproducir este vídeo.
                </video>
              ) : (
                <div className="flex h-[500px] w-full items-center justify-center bg-[#EFE5DD] text-center text-[#6F5645]">
                  No hay vídeo disponible para esta clase.
                </div>
              )}

              <div className="p-8 text-left">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#EFE5DD] px-4 py-1 text-sm font-medium text-[#6F5645]">
                    {video.level}
                  </span>

                  <span className="rounded-full bg-[#EFE5DD] px-4 py-1 text-sm font-medium text-[#6F5645]">
                    {video.category}
                  </span>
                </div>

                <h1 className="text-4xl font-semibold text-[#2F2118]">
                  {video.title}
                </h1>

                <div className="mt-6 flex flex-wrap gap-8 text-[#6F5645]">
                  <div className="flex items-center gap-2">
                    <img src={clockIcon} alt="" className="h-5 w-5" />
                    {video.duration}
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={profileIcon} alt="" className="h-5 w-5" />
                    {video.teacher}
                  </div>
                </div>

                <p className="mt-8 max-w-4xl text-lg leading-relaxed text-[#6F5645]">
                  {video.description}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-[1200px] rounded-[28px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
                  <img src={profileIcon} alt="" className="h-9 w-9" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#2F2118]">
                    {video.teacher}
                  </h3>

                  <p className="mt-1 text-[#6F5645]">
                    Especialista en Pilates y movilidad corporal.
                  </p>
                </div>
              </div>
            </div>

            {recommendedClasses.length > 0 ? (
              <div className="mx-auto mt-10 max-w-[1200px]">
                <h2 className="mb-6 text-2xl font-semibold text-[#2F2118]">
                  Te recomendamos estas clases
                </h2>

                <div
                  ref={carouselRef}
                  className="flex gap-5 overflow-hidden scroll-smooth"
                >
                  {recommendedClasses.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => navigate(`/recorded-classes/${item.id}`)}
                      className="min-w-[255px] max-w-[255px] cursor-pointer overflow-hidden rounded-[20px] bg-secondary transition hover:opacity-90"
                    >
                      <div className="relative overflow-hidden rounded-[18px]">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-[120px] w-full object-cover"
                        />

                        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                          ▶ {item.duration}
                        </span>
                      </div>

                      <div className="pt-3">
                        <h3 className="line-clamp-2 mx-3 text-base font-semibold text-[#2F2118]">
                          {item.title}
                        </h3>

                        <p className="mx-3 mb-2 mt-1 text-sm text-[#6F5645]">
                          Nivel {item.level}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {recommendedClasses.length > 4 && (
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handlePrevRecommended}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl leading-none text-white shadow-md transition hover:opacity-90"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={handleNextRecommended}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl leading-none text-white shadow-md transition hover:opacity-90"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto mt-10 max-w-[1200px] rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 text-center text-[#6F5645] shadow-sm">
                Cuando haya más clases grabadas activas, aparecerán aquí como
                recomendaciones.
              </div>
            )}
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}