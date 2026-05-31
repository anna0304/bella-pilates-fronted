import searchIcon from "../../../assets/lupa.svg";

export function ReservationFilters({
  search,
  setSearch,
  classFilter,
  setClassFilter,
  statusFilter,
  setStatusFilter,
  instructorFilter,
  setInstructorFilter,
  classOptions = [],
  statusOptions = [],
  instructorOptions = [],
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[320px_1fr_180px_220px]">
      <div className="relative">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por usuario, clase..."
          className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 pr-12 outline-none transition focus:border-primary"
        />

        <img
          src={searchIcon}
          alt=""
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
        />
      </div>

      <select
        value={classFilter}
        onChange={(event) => setClassFilter(event.target.value)}
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        {classOptions.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={instructorFilter}
        onChange={(event) => setInstructorFilter(event.target.value)}
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        {instructorOptions.map((instructor) => (
          <option key={instructor} value={instructor}>
            {instructor}
          </option>
        ))}
      </select>
    </div>
  );
}