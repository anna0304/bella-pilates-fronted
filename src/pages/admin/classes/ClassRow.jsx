import eyeIcon from "../../../assets/ojo.svg";
import editIcon from "../../../assets/lapiz.svg";

export function ClassRow({ classItem, onView, onEdit, onToggleStatus }) {
  const isActive = classItem.status === "Activa";

  return (
    <tr className="text-sm text-[#2F2118] transition hover:bg-[#FCF8F5]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={classItem.image}
            alt={classItem.name}
            className="h-12 w-16 rounded-[12px] object-cover"
          />

          <span className="font-medium">{classItem.name}</span>
        </div>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">{classItem.category}</td>

      <td className="px-5 py-4 text-[#6F5645]">{classItem.instructor}</td>

      <td className="px-5 py-4">
        <span className="rounded-full bg-[#F8EADF] px-4 py-1 text-xs font-semibold text-primary">
          {classItem.level}
        </span>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">{classItem.duration}</td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleStatus}
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            isActive
              ? "bg-[#E8F6EC] text-[#1F8A4C]"
              : "bg-[#FDECEC] text-[#D64545]"
          }`}
        >
          {classItem.status}
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={eyeIcon} alt="Ver clase" className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img src={editIcon} alt="Editar clase" className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}