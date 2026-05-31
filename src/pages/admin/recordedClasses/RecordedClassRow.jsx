import { useEffect, useRef, useState } from "react";

import eyeIcon from "../../../assets/ojo.svg";
import editIcon from "../../../assets/lapiz.svg";

const statusOptions = ["Publicada", "Archivada"];

export function RecordedClassRow({ video, onView, onEdit, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (status) => {
    onChangeStatus(video.id, status);
    setIsMenuOpen(false);
  };

  return (
    <tr className="text-sm text-[#2F2118] transition hover:bg-[#FCF8F5]">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-16 w-24 rounded-[12px] object-cover"
            />

            <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
              {video.duration}
            </span>
          </div>

          <div className="min-w-0">
            <p className="break-words font-semibold">{video.title}</p>
            <p className="mt-1 max-w-[320px] text-xs leading-5 text-[#6F5645]">
              {video.description}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <CategoryBadge category={video.category} />
      </td>

      <td className="px-4 py-4 text-[#6F5645]">{video.instructor}</td>

      <td className="px-4 py-4">
        <LevelBadge level={video.level} />
      </td>

      <td className="px-4 py-4 text-[#6F5645]">{video.duration}</td>

      <td className="px-4 py-4">
        <p className="font-medium">{video.publishDate}</p>
        <p className="text-xs text-[#6F5645]">{video.publishTime}</p>
      </td>

      <td className="w-[170px] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={eyeIcon} alt="Ver clase grabada" className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={editIcon} alt="Editar clase grabada" className="h-5 w-5" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] text-xl text-primary transition hover:border-primary"
            >
              ⋮
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-[210px] rounded-[16px] border border-[#E8DDD3] bg-secondary p-2 shadow-xl">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className="w-full rounded-[12px] px-4 py-3 text-left text-sm font-medium text-[#2F2118] transition hover:bg-[#FCF8F5]"
                  >
                    Marcar como {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export function CategoryBadge({ category }) {
  const styles = {
    Mat: "bg-[#E8F6EC] text-[#1F8A4C]",
    Reformer: "bg-[#F1E5F8] text-[#7A3FA0]",
    Flow: "bg-[#E8F0FE] text-[#2D5BBF]",
    Yoga: "bg-[#F8EADF] text-primary",
    Stretching: "bg-[#F8EADF] text-primary",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${
        styles[category] || "bg-[#F8EADF] text-primary"
      }`}
    >
      {category}
    </span>
  );
}

export function LevelBadge({ level }) {
  const styles = {
    Principiante: "bg-[#E8F6EC] text-[#1F8A4C]",
    Intermedio: "bg-[#F1E5F8] text-[#7A3FA0]",
    Avanzado: "bg-[#E8F0FE] text-[#2D5BBF]",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${
        styles[level] || "bg-[#F8EADF] text-primary"
      }`}
    >
      {level}
    </span>
  );
}