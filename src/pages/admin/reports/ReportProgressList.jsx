export function ReportProgressList({
  title,
  labelTitle,
  valueTitle,
  items = [],
  linkText,
  color = "purple",
  suffix = "",
}) {
  const safeItems = items.length > 0 ? items : [{ label: "Sin datos", value: 0 }];
  const maxValue = Math.max(...safeItems.map((item) => item.value), 1);

  const barColor = color === "green" ? "bg-[#4FA45B]" : "bg-[#9B6BE8]";

  return (
    <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#2F2118]">{title}</h2>

      <div className="mt-7 grid grid-cols-[1fr_120px] text-sm font-semibold text-[#2F2118]">
        <span>{labelTitle}</span>
        <span>{valueTitle}</span>
      </div>

      <div className="mt-5 space-y-5">
        {safeItems.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[1fr_120px] items-center gap-4 text-sm"
          >
            <span className="break-words font-medium text-[#2F2118]">
              {item.label}
            </span>

            <div className="flex min-w-0 items-center gap-3">
              <span className="w-10 shrink-0 font-semibold text-[#2F2118]">
                {item.value}
                {suffix}
              </span>

              <div className="h-2 flex-1 rounded-full bg-[#E8DDD3]">
                <div
                  className={`h-2 rounded-full ${barColor}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {linkText && (
        <button className="mt-8 font-semibold text-[#7A3FA0]">
          {linkText} ›
        </button>
      )}
    </article>
  );
}