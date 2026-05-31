import searchIcon from "../../../assets/lupa.svg";

export function ClassFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  statusFilter,
  setStatusFilter,
  categoryOptions = [],
  levelOptions = [],
  statusOptions = [],
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      <div className="relative w-full md:w-[320px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar clase..."
          className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 pr-12 outline-none transition focus:border-primary"
        />

        <img
          src={searchIcon}
          alt=""
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(event) => setCategoryFilter(event.target.value)}
        className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
      >
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={levelFilter}
        onChange={(event) => setLevelFilter(event.target.value)}
        className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
      >
        {levelOptions.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}