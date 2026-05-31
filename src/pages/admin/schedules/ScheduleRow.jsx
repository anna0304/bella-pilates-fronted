import eyeIcon from "../../../assets/ojo.svg";
import editIcon from "../../../assets/lapiz.svg";

export function ScheduleRow({
  schedule,
  onView,
  onEdit,
  onToggleStatus,
}) {
  const isProgrammed =
    schedule?.status?.toLowerCase() === "programado";

  return (
    <tr className="text-sm text-[#2F2118] transition hover:bg-[#FCF8F5]">
      <td className="px-5 py-4">
        <div>
          <p className="font-semibold">
            {schedule?.className || "—"}
          </p>

          <p className="text-xs text-[#6F5645]">
            {schedule?.day || "—"}
          </p>
        </div>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">
        {schedule?.instructor || "—"}
      </td>

      <td className="px-5 py-4 text-[#6F5645]">
        {schedule?.date || "—"}
      </td>

      <td className="px-5 py-4">
        <span className="font-medium">
          {schedule?.startTime || "--:--"} -{" "}
          {schedule?.endTime || "--:--"}
        </span>

        <p className="text-xs text-[#6F5645]">
          {schedule?.duration || "—"}
        </p>
      </td>

      <td className="px-5 py-4 text-[#6F5645]">
        {schedule?.room || "—"}
      </td>

      <td className="px-5 py-4">
        <span className="font-semibold text-[#2F2118]">
          {schedule?.booked ?? 0} /{" "}
          {schedule?.capacity ?? 0}
        </span>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleStatus}
          className={`rounded-full px-4 py-1 text-xs font-semibold ${
            isProgrammed
              ? "bg-[#E8F6EC] text-[#1F8A4C]"
              : "bg-[#FDECEC] text-[#D64545]"
          }`}
        >
          {schedule?.status || "Sin estado"}
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img
              src={eyeIcon}
              alt="Ver horario"
              className="h-5 w-5"
            />
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8DDD3] transition hover:border-primary"
          >
            <img
              src={editIcon}
              alt="Editar horario"
              className="h-5 w-5"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}