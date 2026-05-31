import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { getAdminClasses } from "../../../services/adminClassesService";
import { createAdminRecordedClass } from "../../../services/adminRecordedClassesService";

const levelOptions = [
  { label: "Principiante", value: "beginner" },
  { label: "Intermedio", value: "intermediate" },
  { label: "Avanzado", value: "advanced" },
];

function getClassesFromResponse(response) {
  return response.data || response.classes || response || [];
}

export function CreateRecordedClassPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const [form, setForm] = useState({
    classId: "",
    title: "",
    description: "",
    level: "",
    duration: "",
    videoUrl: "",
    thumbnail: "",
  });

  const selectedClass = useMemo(() => {
    return classes.find((classItem) => classItem.id === Number(form.classId));
  }, [classes, form.classId]);

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadClasses() {
    try {
      setLoadingClasses(true);

      const response = await getAdminClasses();
      const data = getClassesFromResponse(response);

      setClasses(data.filter((classItem) => classItem.is_active));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar clases");
    } finally {
      setLoadingClasses(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.classId) return "Selecciona una clase relacionada.";
    if (!form.title.trim()) return "El título es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.level) return "Selecciona un nivel.";
    if (!form.duration || Number(form.duration) <= 0) {
      return "La duración debe ser un número mayor que 0.";
    }
    if (!form.videoUrl.trim()) return "La URL del video es obligatoria.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showToast(validationError);
      return;
    }

    try {
      setSaving(true);

      await createAdminRecordedClass({
        class_id: Number(form.classId),
        title: form.title.trim(),
        description: form.description.trim(),
        video_url: form.videoUrl.trim(),
        thumbnail: form.thumbnail.trim() || null,
        duration: Number(form.duration),
        level: form.level,
        featured,
        is_active: publishNow,
      });

      showToast("Clase grabada guardada correctamente");

      setTimeout(() => {
        navigate("/admin/recorded-classes");
      }, 1200);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Error al guardar la clase grabada";

      showToast(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <button
          type="button"
          onClick={() => navigate("/admin/recorded-classes")}
          className="mb-6 font-semibold text-primary"
        >
          ← Volver a clases grabadas
        </button>

        <h1 className="text-4xl font-semibold text-[#2F2118]">
          Agregar clase grabada
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Completa la información para añadir una clase grabada desde una URL.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm"
        >
          <section>
            <h2 className="text-xl font-semibold text-primary">
              Información general
            </h2>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Clase relacionada *
                </label>

                <select
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  disabled={loadingClasses}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary disabled:opacity-60"
                >
                  <option value="">
                    {loadingClasses ? "Cargando clases..." : "Seleccionar clase"}
                  </option>

                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Título de la clase *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ej. Pilates Reformer - Fuerza y Control"
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Nivel *
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar nivel</option>

                  {levelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Duración en minutos *
                </label>

                <input
                  name="duration"
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Ej. 45"
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div className="xl:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#2F2118]">
                    Descripción *
                  </label>

                  <span className="text-xs text-[#8B6B52]">
                    {form.description.length}/500
                  </span>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe el contenido de la clase..."
                  className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          <div className="my-8 border-t border-[#E8DDD3]" />

          <section>
            <h2 className="text-xl font-semibold text-primary">
              Video y miniatura
            </h2>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    URL del video *
                  </label>

                  <input
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />

                  <p className="mt-2 text-xs text-[#8B6B52]">
                    Puedes usar una URL de YouTube, Vimeo o un video alojado.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    URL de miniatura
                  </label>

                  <input
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={handleChange}
                    placeholder="https://imagen.com/portada.jpg"
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-[#2F2118]">
                  Vista previa de miniatura
                </p>

                <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] bg-[#FCF8F5]">
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
            </div>
          </section>

          <div className="my-8 border-t border-[#E8DDD3]" />

          <section>
            <h2 className="text-xl font-semibold text-primary">
              Opciones adicionales
            </h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Toggle
                label="¿Publicar la clase ahora?"
                description="Si la desactivas, quedará inactiva."
                enabled={publishNow}
                onClick={() => setPublishNow((current) => !current)}
              />

              <Toggle
                label="¿Destacar esta clase?"
                description="Las clases destacadas aparecerán primero."
                enabled={featured}
                onClick={() => setFeatured((current) => !current)}
              />
            </div>

            {selectedClass && (
              <div className="mt-6 rounded-[18px] border border-[#E8DDD3] bg-white p-5">
                <p className="text-xs font-medium text-[#8B6B52]">
                  Clase seleccionada
                </p>

                <p className="mt-1 font-semibold text-[#2F2118]">
                  {selectedClass.title}
                </p>

                <p className="mt-1 text-sm text-[#6F5645]">
                  Capacidad base: {selectedClass.max_capacity ?? "—"} alumnos
                </p>
              </div>
            )}
          </section>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/recorded-classes")}
              className="rounded-[14px] border border-[#E8DDD3] px-8 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-[14px] bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : publishNow
                  ? "Guardar y publicar"
                  : "Guardar inactiva"}
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
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