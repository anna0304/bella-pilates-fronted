import { useEffect, useState } from "react";

import {
  getAdminSettings,
  updateAdminSettings,
} from "../../../services/adminSettingsService";

const initialForm = {
  business_name: "",
  email: "",
  phone: "",
  address: "",
  instagram: "",
  opening_hours: "",
  footer_text: "",
};

export function CenterInfoSettings({ onSave }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await getAdminSettings();
      const settings = response.data || {};

      setForm({
        business_name: settings.business_name || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        instagram: settings.instagram || "",
        opening_hours: settings.opening_hours || "",
        footer_text: settings.footer_text || "",
      });
    } catch (error) {
      console.error("Error al cargar ajustes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateAdminSettings(form);

      onSave();
    } catch (error) {
      console.error("Error al guardar ajustes:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-6 rounded-[28px] border border-[#E8DDD3] bg-secondary px-5 py-10 text-center text-[#6F5645] shadow-sm">
        Cargando ajustes...
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <section className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#2F2118]">
          Información del centro
        </h2>

        <p className="mt-2 text-sm text-[#6F5645]">
          Estos datos se muestran como información general del centro.
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <Input
            label="Nombre del centro"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <Input
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
          />

          <Input
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <Input
            label="Horario de apertura"
            name="opening_hours"
            value={form.opening_hours}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-[#2F2118]">
              Texto del footer
            </label>

            <span className="text-xs text-[#8B6B52]">
              {form.footer_text.length}/500
            </span>
          </div>

          <textarea
            name="footer_text"
            value={form.footer_text}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
          />
        </div>

        <div className="mt-8 border-t border-[#E8DDD3] pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-[14px] bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </section>
    </form>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label} {required && <span className="text-primary">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none transition focus:border-primary"
      />
    </div>
  );
}