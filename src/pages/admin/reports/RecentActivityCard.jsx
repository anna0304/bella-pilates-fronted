function formatActivityTime(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function RecentActivityCard({ activities = [] }) {
  return (
    <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#2F2118]">
        Actividad reciente
      </h2>

      {activities.length === 0 ? (
        <p className="mt-5 text-sm text-[#6F5645]">
          Todavía no hay actividad reciente para mostrar.
        </p>
      ) : (
        <div className="mt-5 divide-y divide-[#E8DDD3]">
          {activities.map((activity, index) => (
            <div key={`${activity.title}-${index}`} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2F2118]">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-[#6F5645]">
                    {activity.text}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-[#8B6B52]">
                  {formatActivityTime(activity.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}