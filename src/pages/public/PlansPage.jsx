import { Link } from "react-router-dom";

import heroImage from "../../assets/tarifas-hero.jpg";
import ctaImage from "../../assets/tarifas-cta.jpg";
import privadasImage from "../../assets/privadas.jpg";
import packImage from "../../assets/pack.jpg";
import regaloImage from "../../assets/regalo.jpg";

import joseph from "../../assets/joseph.jpg";
import horariosIcon from "../../assets/horarios.svg";
import posturaIcon from "../../assets/postura.svg";
import bienestarIcon from "../../assets/bienestar.svg";
import shieldIcon from "../../assets/shield.svg";
import starIcon from "../../assets/star.svg";

import { Reveal } from "../../components/ui/Reveal";

const plans = [
  {
    name: "Básico",
    price: "49€",
    period: "/ mes",
    description: "Perfecto para empezar tu práctica.",
    features: ["4 clases al mes", "Acceso a horarios base", "Reserva online"],
  },
  {
    name: "Esencial",
    price: "79€",
    period: "/ mes",
    description: "El plan favorito para mantener constancia.",
    features: [
      "8 clases al mes",
      "Prioridad en reservas",
      "Acceso a clases grabadas",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "119€",
    period: "/ mes",
    description: "Para una experiencia completa.",
    features: [
      "Clases ilimitadas",
      "Asesoramiento personalizado",
      "Acceso premium",
    ],
  },
];

const benefits = [
  {
    icon: horariosIcon,
    title: "Reserva flexible",
    description: "Organiza tus clases según tu rutina semanal.",
  },
  {
    icon: posturaIcon,
    title: "Seguimiento personalizado",
    description: "Acompañamiento cercano para mejorar tu práctica.",
  },
  {
    icon: bienestarIcon,
    title: "Bienestar completo",
    description: "Planes pensados para cuerpo, mente y respiración.",
  },
  {
    icon: shieldIcon,
    title: "Sin complicaciones",
    description: "Gestiona tu plan de forma sencilla y clara.",
  },
];

const extras = [
  {
    image: privadasImage,
    title: "Clases privadas",
    description: "Sesiones individuales adaptadas a tus objetivos.",
  },
  {
    image: packImage,
    title: "Pack de sesiones",
    description: "Bonos flexibles para practicar a tu ritmo.",
  },
  {
    image: regaloImage,
    title: "Tarjeta regalo",
    description: "Regala bienestar, calma y movimiento consciente.",
  },
];

export function PlansPage() {
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
                Tarifas
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-tight text-textPrimary lg:text-7xl">
                Elige el plan
                <br />
                perfecto para tu <span className="text-primary">bienestar</span>
              </h1>

              <img
                src={joseph}
                alt=""
                className="mt-6 h-12 object-contain opacity-70"
              />

              <p className="mt-8 max-w-[520px] text-lg leading-9 text-textSecondary">
                Planes flexibles para que puedas disfrutar de Bella Pilates a tu
                ritmo, con opciones pensadas para cada estilo de vida.
              </p>
            </div>

            <div className="group overflow-hidden rounded-[40px] shadow-soft">
              <img
                src={heroImage}
                alt="Tarifas Bella Pilates"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1400px]">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Planes y tarifas
              </p>

              <h2 className="mt-4 text-4xl font-medium text-textPrimary sm:text-5xl">
                Escoge cómo quieres cuidarte
              </h2>

              <img
                src={joseph}
                alt=""
                className="mx-auto mt-3 h-10 object-contain opacity-70"
              />
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative flex min-h-[520px] flex-col rounded-[36px] p-8 shadow-soft transition duration-300 hover:-translate-y-2 ${
                    plan.highlighted
                      ? "bg-[#F0E1D3] ring-2 ring-primary/50"
                      : "bg-[#F7EFE8]"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      Más elegido
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-medium text-textPrimary">
                      {plan.name}
                    </h3>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <img
                        src={plan.highlighted ? starIcon : posturaIcon}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-textSecondary">
                    {plan.description}
                  </p>

                  <div className="mt-8 flex items-end gap-1">
                    <span className="text-5xl font-semibold text-textPrimary">
                      {plan.price}
                    </span>
                    <span className="pb-2 text-sm text-textSecondary">
                      {plan.period}
                    </span>
                  </div>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
                          ✓
                        </div>

                        <p className="text-sm text-textSecondary">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-10">
                    <Link to="/contact">
                      <button
                        className={`w-full rounded-full px-8 py-4 text-sm font-medium transition ${
                          plan.highlighted
                            ? "bg-primary text-white hover:bg-primaryHover"
                            : "bg-secondary text-textPrimary hover:bg-primary hover:text-white"
                        }`}
                      >
                        Solicitar información <span className="ml-2">→</span>
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] rounded-[38px] bg-[#F7EFE8] py-10 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item, index) => (
              <div
                key={item.title}
                className={`px-8 text-center transition duration-300 hover:-translate-y-1 ${
                  index !== benefits.length - 1
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
          <div className="mx-auto max-w-[1400px]">
            <div className="text-center">
              <h2 className="text-4xl font-medium text-textPrimary">
                Complementa tu plan
              </h2>

              <img
                src={joseph}
                alt=""
                className="mx-auto mt-3 h-10 object-contain opacity-70"
              />
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {extras.map((extra) => (
                <article
                  key={extra.title}
                  className="group overflow-hidden rounded-[30px] bg-[#F7EFE8] shadow-soft transition duration-300 hover:-translate-y-2"
                >
                  <img
                    src={extra.image}
                    alt={extra.title}
                    className="h-[210px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-medium text-textPrimary">
                      {extra.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-textSecondary">
                      {extra.description}
                    </p>

                    <Link
                      to="/contact"
                      className="mt-5 inline-block text-sm font-medium text-primary transition hover:translate-x-1"
                    >
                      Más información →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[34px] bg-[#F7EFE8] lg:grid-cols-[1fr_1.25fr]">
            <div className="group overflow-hidden">
              <img
                src={ctaImage}
                alt="Tarifas Bella Pilates"
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
                Elige tu plan ideal y empieza a disfrutar de una experiencia de
                bienestar diseñada para ti.
              </p>

              <div className="mt-8">
                <Link to="/contact">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Habla con nosotros <span className="ml-2">→</span>
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
