import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { addFavorite } from "../../../services/userFavoritesService";

import heartIcon from "../../../assets/bienestar.svg";
import playIcon from "../../../assets/video.svg";

export function RecordedClassCard({ video, onAddFavorite }) {
  const navigate = useNavigate();
  const [savingFavorite, setSavingFavorite] = useState(false);

  const handleAddFavorite = async (event) => {
    event.stopPropagation();

    try {
      setSavingFavorite(true);

      await addFavorite(video.id);
      onAddFavorite?.("Clase añadida a favoritos");
    } catch (error) {
      console.error("Error al añadir favorito:", error);

      const message =
        error?.response?.data?.message || "No se pudo añadir a favoritos";

      onAddFavorite?.(message);
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <article
      onClick={() => navigate(`/recorded-classes/${video.id}`)}
      className="grid cursor-pointer gap-5 rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-sm transition hover:shadow-md lg:grid-cols-[240px_1fr_auto]"
    >
      <div className="relative overflow-hidden rounded-[18px]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-[150px] w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
            <img src={playIcon} alt="" className="h-4 w-4" />
          </span>
        </div>

        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
          {video.duration}
        </span>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#2F2118]">{video.title}</h3>

        <p className="mt-2 text-sm text-[#6F5645]">
          {video.teacher} <span className="mx-2">•</span> {video.level}
          <span className="mx-2">•</span> {video.category}
        </p>

        <p className="mt-4 max-w-2xl leading-relaxed text-[#6F5645]">
          {video.description}
        </p>
      </div>

      <div className="flex items-start justify-between gap-5 lg:flex-col lg:items-end">
        <span className="text-sm text-[#6F5645]">{video.date}</span>

        <button
          type="button"
          disabled={savingFavorite}
          onClick={handleAddFavorite}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#EFE5DD] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <img src={heartIcon} alt="Agregar a favoritos" className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
}