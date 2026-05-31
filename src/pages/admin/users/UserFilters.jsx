import searchIcon from "../../../assets/lupa.svg";
import filterIcon from "../../../assets/flecha.svg";

export function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <div className="relative w-full md:w-[320px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar usuario..."
            className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 pr-12 outline-none transition focus:border-primary"
          />

          <img
            src={searchIcon}
            alt=""
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
        >
          <option>Todos</option>
          <option>Usuario</option>
          <option>Instructor</option>
          <option>Administrador</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
        >
          <option>Todos</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>

        <select className="rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary">
          <option>Fecha de registro</option>
          <option>Más recientes</option>
          <option>Más antiguos</option>
        </select>
      </div>
    </div>
  );
}