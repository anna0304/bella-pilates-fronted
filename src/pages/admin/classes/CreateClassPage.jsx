import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import {
  createAdminClass,
  getAdminClasses,
} from "../../../services/adminClassesService";
import { getAdminUsers } from "../../../services/adminUsersService";

import imageIcon from "../../../assets/camera.svg";

const categoryLabels = {
  reformer: "Reformer",
  mat: "Mat",
  flow: "Flow",
  yoga: "Yoga",
  stretching: "Stretching",
};

const levelLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

function mapCategoryToApi(category) {
  const map = {
    Reformer: "reformer",
    Mat: "mat",
    Flow: "flow",
    Yoga: "yoga",
    Stretching: "stretching",
  };

  return map[category] || category;
}

function mapLevelToApi(level) {
  const map = {
    Principiante: "beginner",
    Intermedio: "intermediate",
    Avanzado: "advanced",
  };

  return map[level] || level;
}

function getDurationNumber(duration) {
  return Number(String(duration).replace("min", "").trim()) || 0;
}

export function CreateClassPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    instructor: "",
    duration: "",
    maxCapacity: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [classesResponse, usersResponse] = await Promise.all([
          getAdminClasses(),
          getAdminUsers(),
        ]);

        const classesData =
          classesResponse.data ||
          classesResponse.classes ||
          classesResponse ||
          [];

        const usersData =
          usersResponse.data || usersResponse.users || usersResponse || [];

        setClasses(classesData);

        const instructorNames = usersData
          .filter((user) => user.role === "instructor")
          .map((user) =>
            [user.name, user.surname].filter(Boolean).join(" ").trim(),
          )
          .filter(Boolean);

        setInstructors([...new Set(instructorNames)]);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  const categoryOptions = useMemo(() => {
    return ["Reformer", "Mat", "Flow", "Yoga", "Stretching"];
  }, []);

  const levelOptions = useMemo(() => {
    return ["Principiante", "Intermedio", "Avanzado"];
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    setForm((currentForm) => ({
      ...currentForm,
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.category ||
      !form.level ||
      !form.instructor ||
      !form.duration ||
      !form.maxCapacity
    ) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", form.name);
      formData.append("instructor_name", form.instructor);
      formData.append("description", form.description || "");
      formData.append("category", mapCategoryToApi(form.category));
      formData.append("level", mapLevelToApi(form.level));
      formData.append("duration", getDurationNumber(form.duration));
      formData.append("max_capacity", Number(form.maxCapacity));

      formData.append("is_active", "1");

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      await createAdminClass(formData);

      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
        navigate("/admin/classes");
      }, 1800);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toastVisible} message="Clase creada correctamente" />

      <section className="mt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-[#2F2118]">Nueva clase</h1>

          <p className="mt-2 text-[#6F5645]">
            Crea una nueva clase para Bella Pilates.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]"
        >
          <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2F2118]">
              Información general
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Nombre de la clase
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Pilates Reformer"
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
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  >
                    <option value="">Seleccionar</option>

                    {categoryOptions.map((category) => (
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
                    value={form.level}
                    onChange={handleChange}
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  >
                    <option value="">Seleccionar</option>

                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                  Instructor
                </label>

                <select
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                >
                  <option value="">Seleccionar instructor</option>

                  {instructors.map((instructor) => (
                    <option key={instructor} value={instructor}>
                      {instructor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Duración
                  </label>

                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="60 min"
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2118]">
                    Capacidad máxima
                  </label>

                  <input
                    type="number"
                    name="maxCapacity"
                    value={form.maxCapacity}
                    onChange={handleChange}
                    placeholder="Ej. 12"
                    className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#2F2118]">
                    Descripción
                  </label>

                  <span className="text-xs text-[#8B6B52]">
                    {form.description.length}/200
                  </span>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={200}
                  rows={6}
                  placeholder="Describe la clase..."
                  className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2F2118]">
              Imagen de portada
            </h2>

            <label className="mt-6 flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#DCCBBE] bg-[#FCF8F5] transition hover:border-primary">
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="h-full w-full rounded-[24px] object-cover"
                />
              ) : (
                <>
                  <img
                    src={imageIcon}
                    alt=""
                    className="h-10 w-10 opacity-70"
                  />

                  <p className="mt-4 font-medium text-[#2F2118]">
                    Subir imagen
                  </p>

                  <span className="mt-2 text-sm text-[#8B6B52]">
                    PNG, JPG o WEBP
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/classes")}
                className="rounded-[14px] border border-[#E8DDD3] px-6 py-4 font-semibold text-primary"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white"
              >
                Crear clase
              </button>
            </div>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
