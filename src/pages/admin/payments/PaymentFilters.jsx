import searchIcon from "../../../assets/lupa.svg";

export function PaymentFilters({
  search,
  setSearch,
  methodFilter,
  setMethodFilter,
  dateFilter,
  setDateFilter,
  methodOptions = [],
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[300px_220px_220px]">
      <div className="relative">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por usuario, email, plan..."
          className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 pr-12 outline-none transition focus:border-primary"
        />

        <img
          src={searchIcon}
          alt=""
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
        />
      </div>

      <select
        value={methodFilter}
        onChange={(event) => setMethodFilter(event.target.value)}
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        {methodOptions.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>

      <select
        value={dateFilter}
        onChange={(event) => setDateFilter(event.target.value)}
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        <option value="all">Todas las fechas</option>
        <option value="today">Hoy</option>
        <option value="week">Esta semana</option>
        <option value="month">Este mes</option>
      </select>
    </div>
  );
}