import heroImage from "../../assets/classes-hero.jpg";

import reformerImage from "../../assets/class-reformer.jpg";
import matImage from "../../assets/class-mat.jpg";
import flowImage from "../../assets/class-flow.jpg";
import advancedImage from "../../assets/class-advanced.jpg";

import posturaIcon from "../../assets/postura.svg";

import nivelesIcon from "../../assets/niveles.svg";
import atencionIcon from "../../assets/atencion.svg";
import horariosIcon from "../../assets/horarios.svg";
import bienestarIcon from "../../assets/bienestar.svg";

import servicePrivate from "../../assets/service-private.jpg";
import serviceTherapeutic from "../../assets/service-therapeutic.jpg";
import serviceAdvice from "../../assets/service-advice.jpg";
import serviceGift from "../../assets/service-gift.jpg";
import classesCta from "../../assets/classes-cta.jpg";
import joseph from "../../assets/joseph.jpg";

import { Link } from "react-router-dom";
import { Reveal } from "../../components/ui/Reveal";

const classes = [
  {
    image: reformerImage,
    title: "Pilates Reformer",
    subtitle: "Fuerza · Control · Precisión",
    description:
      "Mejora tu fuerza, postura y alineación a través del trabajo controlado en máquinas Reformer.",
  },
  {
    image: matImage,
    title: "Pilates Mat",
    subtitle: "Flexibilidad · Equilibrio · Conexión",
    description:
      "Fortalece tu cuerpo, mejora tu flexibilidad y conecta con tu centro desde el suelo hasta el cielo.",
  },
  {
    image: flowImage,
    title: "Pilates Flow",
    subtitle: "Energía · Fluidez · Bienestar",
    description:
      "Clases dinámicas que combinan fuerza, movilidad y respiración para un bienestar completo.",
  },
  {
    image: advancedImage,
    title: "Pilates Reformer",
    subtitle: "Nivel Avanzado",
    description:
      "Sesiones más desafiantes para llevar tu práctica al siguiente nivel y seguir evolucionando.",
  },
];

const benefits = [
  {
    icon: nivelesIcon,
    title: "Para todos los niveles",
    description: "Clases adaptadas a principiantes, intermedios y avanzados.",
  },
  {
    icon: atencionIcon,
    title: "Atención personalizada",
    description: "Grupos reducidos para garantizar una atención de calidad.",
  },
  {
    icon: horariosIcon,
    title: "Horarios flexibles",
    description:
      "Amplia variedad de horarios para que encuentres el que mejor te va.",
  },
  {
    icon: bienestarIcon,
    title: "Tu bienestar es nuestra prioridad",
    description:
      "Cada clase está pensada para que te sientas mejor, por dentro y por fuera.",
  },
];

const additionalServices = [
  {
    image: servicePrivate,
    title: "Clases privadas",
    description:
      "Sesiones individuales adaptadas 100% a tus necesidades y objetivos.",
  },
  {
    image: serviceTherapeutic,
    title: "Pilates terapéutico",
    description:
      "Trabajo específico para mejorar dolencias, lesiones y movilidad.",
  },
  {
    image: serviceAdvice,
    title: "Asesoramiento personalizado",
    description:
      "Te ayudamos a crear un plan de entrenamiento acorde a tu estilo de vida.",
  },
  {
    image: serviceGift,
    title: "Bonos regalo",
    description: "Sorprende a alguien especial con bienestar y movimiento.",
  },
];

export function ClassesPage() {
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
                Clases y servicios
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-tight text-textPrimary lg:text-7xl">
                Clases que se adaptan
                <br />a ti y a tu{" "}
                <span className="text-primary">bienestar</span>
              </h1>

              <img src={posturaIcon} alt="" className="mt-6 h-12 opacity-70" />

              <p className="mt-8 max-w-[520px] text-lg leading-9 text-textSecondary">
                En Bella Pilates ofrecemos diferentes tipos de clases para
                acompañarte en cada etapa de tu camino.
              </p>

              <p className="mt-5 max-w-[520px] text-lg leading-9 text-textSecondary">
                Elige la que mejor se adapte a ti y empieza a sentirte mejor
                desde la primera sesión.
              </p>
            </div>

            <div className="group overflow-hidden rounded-[40px] shadow-soft">
              <img
                src={heroImage}
                alt="Clases Bella Pilates"
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
              <h2 className="text-5xl font-medium text-textPrimary">
                Nuestras clases
              </h2>

              <img
                src={posturaIcon}
                alt=""
                className="mx-auto mt-3 h-10 opacity-70"
              />
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {classes.map((item) => (
                <article
                  key={item.title + item.subtitle}
                  className="group overflow-hidden rounded-[34px] bg-[#F7EFE8] transition duration-300 hover:-translate-y-2 hover:shadow-soft"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="relative p-6">
                    <div className="absolute -top-8 left-6 flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#F7EFE8] bg-secondary">
                      <img src={posturaIcon} alt="" className="h-8 w-8" />
                    </div>

                    <h3 className="mt-5 text-2xl font-medium text-textPrimary">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-primary">
                      {item.subtitle}
                    </p>

                    <p className="mt-5 text-sm leading-7 text-textSecondary">
                      {item.description}
                    </p>

                    <Link
                      to="/schedules"
                      className="mt-6 inline-block text-sm font-medium text-primary transition hover:translate-x-1"
                    >
                      Ver más →
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
                className={`
                  px-8 text-center transition duration-300 hover:-translate-y-1
                  ${
                    index !== benefits.length - 1
                      ? "xl:border-r border-[#E9D8C8]"
                      : ""
                  }
                `}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="mx-auto h-14"
                />

                <h3 className="mt-5 text-xl font-medium text-textPrimary">
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

      <section className="bg-[#F3E8DE] px-5 pb-8 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1400px]">
            <div className="text-center">
              <h2 className="text-4xl font-medium text-textPrimary">
                Servicios adicionales
              </h2>

              <img
                src={posturaIcon}
                alt=""
                className="mx-auto mt-3 h-10 opacity-70"
              />
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {additionalServices.map((service) => (
                <article
                  key={service.title}
                  className="group overflow-hidden rounded-[28px] bg-[#F7EFE8] transition duration-300 hover:-translate-y-2 hover:shadow-soft"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-[170px] w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="p-6">
                    <h3 className="text-lg font-medium text-textPrimary">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-textSecondary">
                      {service.description}
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
                src={classesCta}
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
                <Link to="/schedules">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Ver horarios <span className="ml-2">→</span>
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