import { useState } from "react";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { CenterInfoSettings } from "./CenterInfoSettings";

export function AdminSettingsPage() {
  const [toastVisible, setToastVisible] = useState(false);

  const showSavedToast = () => {
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  };

  return (
    <AdminLayout>
      <Toast
        visible={toastVisible}
        message="Cambios guardados correctamente"
      />

      <section className="mt-8">
        <h1 className="text-4xl font-semibold text-[#2F2118]">
          Configuración del centro
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Gestiona la información general visible del centro.
        </p>

        <div className="mt-6">
          <CenterInfoSettings onSave={showSavedToast} />
        </div>
      </section>
    </AdminLayout>
  );
}