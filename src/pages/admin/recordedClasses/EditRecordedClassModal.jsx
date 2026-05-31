import { useEffect, useState } from "react";

const levelOptions = ["Principiante", "Intermedio", "Avanzado"];
const statusOptions = ["Publicada", "Archivada"];

export function EditRecordedClassModal({ video, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!video) {
      setForm(null);
      return;
    }

    setForm({
      ...video,
      videoUrl: video.videoUrl || video.raw?.video_url || "",
      thumbnail: video.thumbnail || video.raw?.thumbnail || "",
      featured: Boolean(video.featured),
    });
  }, [video]);

  if (!video || !form) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleToggleFeatured = () => {
    setForm((currentForm) => ({
      ...currentForm,
      featured: !currentForm.featured,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Editar clase grabada
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Actualiza la información y enlaces de la clase grabada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h3 className="mb-4 text-lg font-semibold text-primary">
              Información general
            </h3>

            <Input
              label="Título"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <ReadOnlyField label="Clase relacionada" value={form.className} />
              <Select
                label="Nivel"
                name="level"
                value={form.level}
                onChange={handleChange}
                options={levelOptions}
              />
              <Select
                label="Estado"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={statusOptions}
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ReadOnlyField label="Instructor" value={form.instructor} />

              <Input
                label="Duración en minutos"
                name="durationNumber"
                type="number"
                value={form.durationNumber}
                onChange={handleChange}
              />
            </div>

            <div className="mt-5">
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
          </section>

          <div className="border-t border-[#E8DDD3]" />

          <section>
            <h3 className="mb-4 text-lg font-semibold text-primary">
              Video y miniatura
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="URL del video"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
              />

              <Input
                label="URL de miniatura"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
              />
            </div>

            <div className="mt-5 rounded-[18px] border border-[#E8DDD3] bg-white p-5">
              <p className="mb-3 text-sm font-medium text-[#2F2118]">
                Vista previa de miniatura
              </p>

              <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-[16px] bg-[#FCF8F5]">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[#D8C8BA]">Sin miniatura</span>
                )}
              </div>
            </div>
          </section>

          <div className="border-t border-[#E8DDD3]" />

          <section>
            <h3 className="mb-4 text-lg font-semibold text-primary">
              Opciones
            </h3>

            <Toggle
              label="Clase destacada"
              description="Las clases destacadas aparecerán primero."
              enabled={form.featured}
              onClick={handleToggleFeatured}
            />
          </section>

          <div className="flex flex-col gap-3 border-t border-[#E8DDD3] pt-6 md:flex-row md:justify-end">
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

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label}
      </label>

      <div className="min-h-[56px] rounded-[14px] border border-[#E8DDD3] bg-[#F7EFE8] px-5 py-4 text-[#6F5645]">
        {value || "—"}
      </div>
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label}
      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, description, enabled, onClick }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-medium text-[#2F2118]">{label}</span>

        <button
          type="button"
          onClick={onClick}
          className={`relative h-8 w-14 rounded-full transition ${
            enabled ? "bg-primary" : "bg-[#D8C8BA]"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
              enabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      <p className="mt-2 text-sm text-[#6F5645]">{description}</p>
    </div>
  );
}