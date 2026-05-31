import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";
import { LoadingPage } from "../../../components/ui/LoadingPage";
import { ErrorState } from "../../../components/ui/ErrorState";

import {
  changePassword,
  getMe,
  updateProfile,
} from "../../../services/authService";

import heroImage from "../../../assets/dashboard-hero.jpg";
import josephImage from "../../../assets/joseph.jpg";

import profileIcon from "../../../assets/perfil.svg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import policyIcon from "../../../assets/policy.svg";
import bellIcon from "../../../assets/campana.svg";
import lockIcon from "../../../assets/candado.svg";
import arrowIcon from "../../../assets/flecha.svg";

export function ProfilePage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    status: "active",
    created_at: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    classReminders: true,
    centerNews: true,
    recordedClasses: true,
  });

  const showToast = (message) => {
    setToast({
      visible: true,
      message,
    });

    setTimeout(() => {
      setToast({
        visible: false,
        message: "",
      });
    }, 1800);
  };

  async function loadProfile() {
    try {
      setLoadingProfile(true);
      setErrorProfile(false);

      const response = await getMe();
      const user = response.user;

      setProfile({
        name: user?.name || "",
        surname: user?.surname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        status: user?.status || "active",
        created_at: user?.created_at || "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setErrorProfile(true);
      showToast("Error al cargar tu perfil");
    } finally {
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((currentPasswords) => ({
      ...currentPasswords,
      [name]: value,
    }));
  };

  const togglePreference = (key) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: !currentPreferences[key],
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);

      const response = await updateProfile({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        phone: profile.phone,
      });

      const updatedUser = response.user;

      localStorage.setItem("bella_pilates_user", JSON.stringify(updatedUser));

      setProfile((currentProfile) => ({
        ...currentProfile,
        ...updatedUser,
      }));

      showToast("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      const message =
        error?.response?.data?.message || "Error al actualizar perfil";

      showToast(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (!passwords.newPassword || !passwords.confirmPassword) {
      showToast("Completa los campos de contraseña");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("Las contraseñas no coinciden");
      return;
    }

    try {
      setSavingPassword(true);

      await changePassword({
        password: passwords.newPassword,
        password_confirmation: passwords.confirmPassword,
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast("Contraseña actualizada correctamente");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      const message =
        error?.response?.data?.message || "Error al cambiar contraseña";

      showToast(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    showToast("Preferencias guardadas correctamente");
  };

  const memberSince = profile.created_at
    ? new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric",
      }).format(new Date(profile.created_at))
    : "No disponible";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
      <Toast visible={toast.visible} message={toast.message} />

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-[260px] max-w-[85vw]">
            <DashboardSidebar />
          </div>
        </div>
      )}

      <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
        <div className="p-5 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl text-white lg:hidden"
            >
              ☰
            </button>

            <DashboardHeader />
          </div>

          {loadingProfile ? (
            <LoadingPage text="Cargando tu perfil..." />
          ) : errorProfile ? (
            <ErrorState
              title="No pudimos cargar tu perfil"
              message="Inténtalo de nuevo dentro de unos minutos."
              actionText="Reintentar"
              onAction={loadProfile}
            />
          ) : (
            <section>
              <div className="overflow-hidden rounded-[28px] border border-[#E8DDD3] bg-secondary shadow-sm">
                <div className="grid min-h-[260px] grid-cols-1 lg:grid-cols-2">
                  <div className="flex flex-col justify-center p-8 lg:p-10">
                    <div className="flex items-center gap-4">
                      <h1 className="text-5xl font-semibold text-[#2F2118]">
                        Mi perfil
                      </h1>

                      <img
                        src={josephImage}
                        alt=""
                        className="h-16 w-16 object-contain opacity-70"
                      />
                    </div>

                    <p className="mt-5 max-w-md text-[#6F5645]">
                      Gestiona tu información personal y preferencias de cuenta.
                    </p>
                  </div>

                  <img
                    src={heroImage}
                    alt="Bella Pilates"
                    className="hidden h-full w-full object-cover lg:block"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm"
                >
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DD]">
                      <img src={profileIcon} alt="" className="h-6 w-6" />
                    </div>

                    <h2 className="text-2xl font-semibold text-[#2F2118]">
                      Información personal
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <InputField
                        label="Nombre"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                      />

                      <InputField
                        label="Apellido"
                        name="surname"
                        value={profile.surname}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <InputField
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />

                    <InputField
                      label="Teléfono"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <Button2
                    variant="primary"
                    className="mt-7"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Guardando..." : "Guardar cambios"}
                  </Button2>
                </form>

                <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#E8DDD3] bg-[#EFE5DD]">
                      <img
                        src={profileIcon}
                        alt={profile.name || "Usuario"}
                        className="h-14 w-14"
                      />
                    </div>

                    <h2 className="mt-5 text-2xl font-semibold text-[#2F2118]">
                      {profile.name || "Usuario"}
                    </h2>

                    <span
                      className={`mt-3 rounded-full px-4 py-1 text-sm font-medium ${
                        profile.status === "active"
                          ? "bg-[#E8F6EC] text-[#1F8A4C]"
                          : "bg-[#FDECEC] text-[#D64545]"
                      }`}
                    >
                      {profile.status === "active"
                        ? "Miembro activo"
                        : "Miembro inactivo"}
                    </span>
                  </div>

                  <div className="my-8 border-t border-[#E8DDD3]" />

                  <div className="space-y-5 text-sm text-[#6F5645]">
                    <InfoLine
                      icon={calendarIcon}
                      label="Miembro desde"
                      value={memberSince}
                    />

                    <InfoLine
                      icon={calendarIcon}
                      label="Plan actual"
                      value="Pendiente"
                    />

                    <InfoLine
                      icon={clockIcon}
                      label="Próximo pago"
                      value="Pendiente"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
                <form
                  id="security"
                  onSubmit={handleUpdatePassword}
                  className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm"
                >
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DD]">
                      <img src={lockIcon} alt="" className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-[#2F2118]">
                        Seguridad de la cuenta
                      </h2>
                      <p className="text-sm text-[#6F5645]">
                        Mantén tu cuenta segura actualizando tu contraseña.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <input
                      name="currentPassword"
                      type="password"
                      placeholder="Contraseña actual (opcional)"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-[16px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                    />

                    <input
                      name="newPassword"
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-[16px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                    />

                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-[16px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                    />
                  </div>

                  <Button2
                    variant="primary"
                    className="mt-7"
                    disabled={savingPassword}
                  >
                    {savingPassword
                      ? "Actualizando..."
                      : "Actualizar contraseña"}
                  </Button2>
                </form>

                <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-sm">
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DD]">
                      <img src={bellIcon} alt="" className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-[#2F2118]">
                        Preferencias
                      </h2>
                      <p className="text-sm text-[#6F5645]">
                        Gestiona tus preferencias de notificaciones.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-7">
                    {[
                      {
                        key: "classReminders",
                        title: "Recordatorios de clases",
                        text: "Recibe recordatorios antes de tus clases reservadas.",
                      },
                      {
                        key: "centerNews",
                        title: "Novedades del centro",
                        text: "Recibe noticias y novedades de Bella Pilates.",
                      },
                      {
                        key: "recordedClasses",
                        title: "Clases grabadas",
                        text: "Nuevos videos y contenido disponible.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-5"
                      >
                        <div>
                          <h3 className="font-semibold text-[#2F2118]">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-[#6F5645]">
                            {item.text}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => togglePreference(item.key)}
                          className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                            preferences[item.key]
                              ? "justify-end bg-primary"
                              : "justify-start bg-[#D8C8BA]"
                          }`}
                        >
                          <span className="h-5 w-5 rounded-full bg-white" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Button2
                    variant="outline"
                    className="mt-8 w-full"
                    onClick={handleSavePreferences}
                  >
                    Guardar preferencias
                  </Button2>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#E8DDD3] bg-secondary p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DD]">
                    <img src={policyIcon} alt="" className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#2F2118]">
                      ¿Necesitas ayuda?
                    </h2>
                    <p className="text-sm text-[#6F5645]">
                      Estamos aquí para ayudarte. Contáctanos si tienes alguna
                      duda.
                    </p>
                  </div>
                </div>

                <Button2
                  variant="outline"
                  onClick={() => navigate("/user/contact")}
                >
                  Contactar con el centro
                  <img src={arrowIcon} alt="" className="h-4 w-4" />
                </Button2>
              </div>
            </section>
          )}
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2F2118]">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-[16px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
      />
    </div>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={icon} alt="" className="h-5 w-5" />
        <span>{label}</span>
      </div>
      <span>{value}</span>
    </div>
  );
}