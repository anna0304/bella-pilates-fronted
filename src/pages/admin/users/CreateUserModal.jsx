import { useState } from "react";

export function CreateUserModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Usuario",
    status: "Activo",
  });

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onCreate(form);

    setForm({
      name: "",
      email: "",
      role: "Usuario",
      status: "Activo",
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-[520px] rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#2F2118]">
            Nuevo usuario
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Nombre completo
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Rol
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                <option>Usuario</option>
                <option>Administrador</option>
                <option>Instructor</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Estado
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
            >
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}