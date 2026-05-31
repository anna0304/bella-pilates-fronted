import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#65B96E", "#F6A23A", "#F05C5C"];

export function ReportDonutCard({ title, data, centerText, footer }) {
  return (
    <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#2F2118]">{title}</h2>

      <div className="mt-6 grid items-center gap-4 md:grid-cols-[160px_1fr] xl:grid-cols-1">
        <div className="relative h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={48}
                outerRadius={78}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-[#2F2118]">
              {centerText}
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-[#2F2118]">{item.name}</span>
              <span className="ml-auto font-semibold text-[#6F5645]">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 font-semibold text-[#2F2118]">{footer}</p>
    </article>
  );
}