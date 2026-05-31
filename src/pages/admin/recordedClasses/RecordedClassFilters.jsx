import searchIcon from "../../../assets/lupa.svg";

export function RecordedClassFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  categoryOptions = [],
  levelOptions = [],
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[340px_1fr_220px]">
      <div className="relative">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título, categoría..."
          className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 pr-12 outline-none transition focus:border-primary"
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
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
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
        className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 outline-none transition focus:border-primary"
      >
        {levelOptions.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
}