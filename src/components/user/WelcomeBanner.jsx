import { useEffect, useState } from "react";

import { getMe } from "../../services/authService";

import heroImage from "../../assets/dashboard-hero.jpg";

export function WelcomeBanner() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();
        setUserName(response.user?.name || "");
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <section className="mt-8 overflow-hidden rounded-[32px] bg-secondary shadow-sm">
      <div className="relative grid min-h-[240px] grid-cols-1 lg:grid-cols-2">
        <div className="z-10 flex flex-col justify-center p-8 lg:p-12">
          <h1 className="max-w-md text-4xl font-semibold leading-tight text-[#2F2118] xl:text-5xl">
            Bienvenida{userName ? `, ${userName}` : ""} a Bella Pilates
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-[#6F5645]">
            Organiza tus clases, revisa tus reservas y continúa entrenando desde
            casa.
          </p>
        </div>

        <div className="relative hidden lg:block">
          <img
            src={heroImage}
            alt="Estudio de pilates"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-secondary to-transparent" />
        </div>
      </div>
    </section>
  );
}