import { useEffect, useState } from "react";

export function EditClassModal({
  classItem,
  onClose,
  onSave,
  categoryOptions = [],
  levelOptions = [],
  instructorOptions = [],
  statusOptions = [],
}) {
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setForm(classItem);
    setPreview(classItem?.image || "");
  }, [classItem]);

  if (!classItem || !form) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    setForm((currentForm) => ({
      ...currentForm,
      image: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  const cleanCategoryOptions = categoryOptions.filter(
    (option) => option !== "Todas",
  );

  const cleanLevelOptions = levelOptions.filter((option) => option !== "Todos");

  const cleanStatusOptions = statusOptions.filter(
    (option) => option !== "Todos",
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#2F2118]">
            Editar clase
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
              Imagen de portada
            </label>

            <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-center">
              <img
                src={preview}
                alt=""
                className="h-32 w-full rounded-[18px] object-cover"
              />

              <label className="flex cursor-pointer items-center justify-center rounded-[14px] border border-primary px-6 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]">
                Cambiar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Nombre de la clase
            </label>

            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Categoría
              </label>

              <select
                name="category"
                value={form.category || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                {cleanCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Nivel
              </label>

              <select
                name="level"
                value={form.level || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                {cleanLevelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Instructor
              </label>

              <select
                name="instructor"
                value={form.instructor || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              >
                <option value="">Seleccionar instructor</option>

                {instructorOptions.map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Duración
              </label>

              <input
                name="duration"
                value={form.duration || ""}
                onChange={handleChange}
                placeholder="60 min"
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                Capacidad
              </label>

              <input
                name="maxCapacity"
                type="number"
                value={form.maxCapacity || ""}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Estado
            </label>

            <select
              name="status"
              value={form.status || ""}
              onChange={handleChange}
              className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            >
              {cleanStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2F2118]">
              Descripción
            </label>

            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={5}
              className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
            />
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
