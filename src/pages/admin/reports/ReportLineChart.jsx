import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ReportLineChart({
  title,
  data,
  dataKey = "value",
  xKey = "day",
  type = "area",
  compact = false,
}) {
  return (
    <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2F2118]">{title}</h2>

        {!compact && (
          <select className="rounded-[12px] border border-[#E8DDD3] bg-white px-4 py-2 text-sm outline-none">
            <option>Esta semana</option>
            <option>Este mes</option>
          </select>
        )}
      </div>

      <div className={compact ? "h-[260px]" : "h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#C59A72" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#8B45D9"
                fill="#E9D8FF"
                strokeWidth={3}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}