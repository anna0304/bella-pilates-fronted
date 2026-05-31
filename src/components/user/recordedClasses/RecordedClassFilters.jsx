import arrowIcon from "../../../assets/flecha.svg";

export function RecordedClassFilters({
  search,
  onSearchChange,
  selectedLevel,
  setSelectedLevel,
  selectedType,
  setSelectedType,
  selectedDuration,
  setSelectedDuration,
  sortBy,
  setSortBy,
}) {
  const selectStyle =
    "appearance-none rounded-[18px] border border-[#E8DDD3] bg-secondary px-5 py-4 pr-12 text-sm font-semibold text-[#6F5645] outline-none transition focus:border-primary";

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Buscar clases..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-[18px] border border-[#E8DDD3] bg-secondary px-5 py-4 outline-none transition focus:border-primary lg:max-w-[300px]"
      />

      <div className="relative">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className={selectStyle}
        >
          <option value="">Nivel</option>
          <option value="Nivel Principiante">Principiante</option>
          <option value="Nivel Intermedio">Intermedio</option>
          <option value="Nivel Avanzado">Avanzado</option>
        </select>

        <img
          src={arrowIcon}
          alt=""
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
        />
      </div>

      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={selectStyle}
        >
          <option value="">Tipo de clase</option>
          <option value="mat">Mat</option>
          <option value="reformer">Reformer</option>
          <option value="flow">Flow</option>
          <option value="yoga">Yoga</option>
          <option value="stretching">Stretching</option>
        </select>

        <img
          src={arrowIcon}
          alt=""
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
        />
      </div>

      <div className="relative">
        <select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          className={selectStyle}
        >
          <option value="">Duración</option>
          <option value="short">0 - 25 min</option>
          <option value="medium">25 - 35 min</option>
          <option value="long">35+ min</option>
        </select>

        <img
          src={arrowIcon}
          alt=""
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
        />
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={selectStyle}
        >
          <option value="recent">Más recientes</option>
          <option value="old">Más antiguos</option>
        </select>

        <img
          src={arrowIcon}
          alt=""
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
        />
      </div>
    </div>
  );
}