import { Link } from "react-router-dom";

import heroImage from "../../assets/horarios-hero.jpg";
import ctaImage from "../../assets/horarios-cta.jpg";

import horariosIcon from "../../assets/horarios.svg";
import atencionIcon from "../../assets/atencion.svg";
import relojIcon from "../../assets/reloj.svg";
import bienestarIcon from "../../assets/bienestar.svg";
import posturaIcon from "../../assets/postura.svg";
import starIcon from "../../assets/star.svg";
import cellIcon from "../../assets/cell.svg";
import mailIcon from "../../assets/mail.svg";
import logo from "../../assets/logo.svg";
import joseph from "../../assets/joseph.jpg";

import { Reveal } from "../../components/ui/Reveal";

const features = [
  {
    icon: horariosIcon,
    title: "Horarios amplios",
    description: "Clases desde primera hora de la mañana hasta la noche.",
  },
  {
    icon: atencionIcon,
    title: "Grupos reducidos",
    description: "Atención personalizada para tu máximo progreso.",
  },
  {
    icon: relojIcon,
    title: "Flexibilidad total",
    description: "Elige el horario que mejor se adapte a tu rutina.",
  },
  {
    icon: bienestarIcon,
    title: "Tu bienestar, siempre",
    description: "Estamos aquí para acompañarte en cada paso del camino.",
  },
];

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const schedule = [
  ["7:00", "—", "Mat", "—", "Mat", "—", "Reformer", "—"],
  ["8:30", "Reformer", "Flow", "Reformer", "Flow", "Reformer", "Mat", "—"],
  ["10:00", "Mat", "Reformer", "Mat", "Reformer", "Mat", "Flow", "—"],
  ["11:30", "Flow", "Mat", "Flow", "Mat", "Flow", "Reformer", "—"],
  ["13:00", "—", "Reformer", "—", "Reformer", "—", "—", "—"],
  ["17:00", "Reformer", "Flow", "Reformer", "Flow", "Reformer", "—", "—"],
  ["18:30", "Mat", "Reformer", "Mat", "Reformer", "Mat", "—", "—"],
  ["20:00", "Flow", "Mat", "Flow", "Mat", "Flow", "—", "—"],
];

const classColors = {
  Reformer: "bg-[#F4D9C8] text-textPrimary",
  Mat: "bg-[#DEE8D0] text-textPrimary",
  Flow: "bg-[#E6D8F1] text-textPrimary",
  Avanzado: "bg-[#F8E4BD] text-textPrimary",
};

const specialClasses = [
  {
    title: "Clases privadas",
    subtitle: "Horarios flexibles",
  },
  {
    title: "Pilates terapéutico",
    subtitle: "Consulta disponibilidad",
  },
  {
    title: "Embarazo y postparto",
    subtitle: "Grupos reducidos",
  },
];

export function SchedulesPage() {
  return (
    <main className="overflow-hidden bg-[#F3E8DE] pt-28">
      <section className="relative overflow-hidden px-5 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] animate-[backgroundFlow_18s_ease-in-out_infinite] rounded-full bg-[#DCC5B0] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[440px] w-[440px] animate-[backgroundFlowReverse_20s_ease-in-out_infinite] rounded-full bg-[#E9D8C8] blur-[120px]" />
        </div>

        <Reveal>
          <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                Horarios
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-tight text-textPrimary lg:text-7xl">
                Encuentra el horario
                <br />
                que mejor{" "}
                <span className="text-primary">se adapta a ti</span>
              </h1>

              <img
                src={joseph}
                alt=""
                className="mt-6 h-12 object-contain opacity-70"
              />

              <p className="mt-8 max-w-[520px] text-lg leading-9 text-textSecondary">
                Contamos con una amplia variedad de clases durante toda la
                semana para que puedas elegir el momento perfecto para practicar.
              </p>
            </div>

            <div className="group overflow-hidden rounded-[40px] shadow-soft">
              <img
                src={heroImage}
                alt="Horarios Bella Pilates"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] rounded-[38px] bg-[#F7EFE8] py-10 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item, index) => (
              <div
                key={item.title}
                className={`px-8 text-center transition duration-300 hover:-translate-y-1 ${
                  index !== features.length - 1
                    ? "xl:border-r border-[#E9D8C8]"
                    : ""
                }`}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <img src={item.icon} alt={item.title} className="h-9 w-9" />
                </div>

                <h3 className="mt-5 text-lg font-medium text-textPrimary">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-textSecondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1400px] rounded-[38px] bg-[#F7EFE8] px-6 py-10 shadow-soft sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-4xl font-medium text-textPrimary">
                  Horarios de clases
                </h2>

                <img
                  src={joseph}
                  alt=""
                  className="mt-2 h-10 object-contain opacity-70"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-textSecondary">
                {Object.entries(classColors).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${color}`} />
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-center text-sm">
                <thead>
                  <tr className="border-b border-[#E9D8C8] text-textPrimary">
                    <th className="py-4 text-left font-semibold">Hora</th>

                    {days.map((day) => (
                      <th key={day} className="py-4 font-semibold">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {schedule.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-[#E9D8C8]/70 last:border-0"
                    >
                      <td className="py-4 text-left font-semibold text-textPrimary">
                        {row[0]}
                      </td>

                      {row.slice(1).map((className, index) => (
                        <td key={index} className="px-2 py-3">
                          {className === "—" ? (
                            <span className="text-primary/60">—</span>
                          ) : (
                            <span
                              className={`mx-auto block max-w-[120px] rounded-xl px-4 py-2 font-medium ${
                                classColors[className] ?? "bg-secondary"
                              }`}
                            >
                              {className}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-xs text-textSecondary">
              ⓘ Los horarios pueden estar sujetos a cambios. Consulta la
              disponibilidad al realizar tu reserva.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-3">
          <Reveal>
            <article className="flex h-full min-h-[390px] flex-col rounded-[34px] bg-[#F7EFE8] p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <img src={horariosIcon} alt="" className="h-9 w-9" />
                <h3 className="text-2xl font-medium text-textPrimary">
                  Horarios de atención
                </h3>
              </div>

              <div className="mt-8 space-y-4 text-sm text-textPrimary">
                <div className="flex justify-between border-b border-[#E9D8C8] pb-3">
                  <span>Lunes a Viernes</span>
                  <span>7:00 - 21:00</span>
                </div>

                <div className="flex justify-between border-b border-[#E9D8C8] pb-3">
                  <span>Sábado</span>
                  <span>8:00 - 14:00</span>
                </div>

                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span>Cerrado</span>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-4 rounded-[22px] bg-[#F0E1D3] p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70">
                  <img
                    src={relojIcon}
                    alt="Horario"
                    className="h-6 w-6 object-contain"
                  />
                </div>

                <p className="text-sm leading-6 text-textSecondary">
                  Nuestro equipo te responderá durante el horario de atención.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <article className="flex h-full min-h-[390px] flex-col rounded-[34px] bg-[#F7EFE8] p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <img src={starIcon} alt="" className="h-9 w-9" />
                <h3 className="text-2xl font-medium text-textPrimary">
                  Clases especiales
                </h3>
              </div>

              <div className="mt-8 space-y-5">
                {specialClasses.map((item) => (
                  <Link
                    key={item.title}
                    to="/contact"
                    className="flex items-center justify-between border-b border-[#E9D8C8] pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-textPrimary">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm text-textSecondary">
                        {item.subtitle}
                      </p>
                    </div>

                    <span className="text-primary">→</span>
                  </Link>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal>
            <article className="flex h-full min-h-[390px] flex-col rounded-[34px] bg-[#F0E1D3] p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Bella Pilates"
                  className="h-10 w-10 object-contain"
                />

                <h3 className="text-2xl font-medium text-textPrimary">
                  ¿Necesitas ayuda?
                </h3>
              </div>

              <p className="mt-6 text-sm leading-7 text-textSecondary">
                Estamos aquí para ayudarte a encontrar el horario perfecto para
                ti.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7EFE8]">
                    <img
                      src={cellIcon}
                      alt="Teléfono"
                      className="h-5 w-5 object-contain"
                    />
                  </div>

                  <span className="text-sm text-textSecondary">
                    +34 600 123 456
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7EFE8]">
                    <img
                      src={mailIcon}
                      alt="Email"
                      className="h-5 w-5 object-contain"
                    />
                  </div>

                  <span className="text-sm text-textSecondary">
                    hola@bellapilates.com
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <Link to="/contact">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Contáctanos <span className="ml-2">→</span>
                  </button>
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[34px] bg-[#F7EFE8] lg:grid-cols-[1fr_1.25fr]">
            <div className="group overflow-hidden">
              <img
                src={ctaImage}
                alt="Reserva tu clase de pilates"
                className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-full"
              />
            </div>

            <div className="relative flex flex-col justify-center px-8 py-12 sm:px-10 lg:px-14">
              <h2 className="max-w-[620px] text-3xl font-medium leading-tight text-textPrimary sm:text-4xl">
                Empieza hoy tu camino hacia
                <br />
                una vida más saludable
              </h2>

              <p className="mt-5 max-w-[560px] text-sm leading-7 text-textSecondary">
                Reserva tu primera clase y descubre todo lo que el Pilates puede
                hacer por ti.
              </p>

              <div className="mt-8">
                <Link to="/classes">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Ver clases <span className="ml-2">→</span>
                  </button>
                </Link>
              </div>

              <img
                src={joseph}
                alt=""
                className="pointer-events-none absolute right-8 top-1/2 hidden h-40 w-40 -translate-y-1/2 object-contain opacity-30 lg:block"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}