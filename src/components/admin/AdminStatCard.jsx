export function AdminStatCard({ icon, title, value, percentage, comparison }) {
  return (
    <article className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE5DD]">
          <img src={icon} alt="" className="h-7 w-7" />
        </div>

        <div>
          <p className="text-sm text-[#6F5645]">{title}</p>
          <h3 className="mt-1 text-3xl font-semibold text-[#2F2118]">
            {value}
          </h3>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="rounded-full bg-[#E8F6EC] px-3 py-1 text-sm font-semibold text-[#1F8A4C]">
          {percentage}
        </span>

        <span className="text-sm text-[#6F5645]">{comparison}</span>
      </div>

      <div className="mt-6 h-10 rounded-full border-b-2 border-primary/50" />
    </article>
  );
}