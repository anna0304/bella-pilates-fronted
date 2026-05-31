import { Link } from "react-router-dom";

import heroImage from "../../assets/about-hero.jpg";
import equipo1 from "../../assets/equipo1.jpg";
import equipo2 from "../../assets/equipo2.jpg";
import equipo3 from "../../assets/equipo3.jpg";
import espacioImage from "../../assets/espacio.jpg";

import joseph from "../../assets/joseph.jpg";
import nivelesIcon from "../../assets/niveles.svg";
import bienestarIcon from "../../assets/bienestar.svg";
import estresIcon from "../../assets/estres.svg";
import solIcon from "../../assets/sol.svg";
import ambienteIcon from "../../assets/ambiente.svg";
import posturaIcon from "../../assets/postura.svg";
import candadoIcon from "../../assets/candado.svg";

import { Reveal } from "../../components/ui/Reveal";

const values = [
  {
    icon: nivelesIcon,
    title: "Bienestar integral",
    description: "Cuidamos tu cuerpo y tu mente para que vivas en equilibrio.",
  },
  {
    icon: bienestarIcon,
    title: "Comunidad",
    description:
      "Creamos un espacio cercano y acogedor donde te sientes en casa.",
  },
  {
    icon: estresIcon,
    title: "Calidad",
    description: "Clases cuidadas, atención profesional y acompañamiento real.",
  },
  {
    icon: solIcon,
    title: "Constancia",
    description: "Te acompañamos en tu camino con motivación y compromiso.",
  },
];

const team = [
  {
    image: equipo1,
    name: "Laura Gómez",
    role: "Instructora principal",
    description:
      "Especialista en Pilates Reformer y movimiento funcional. Más de 8 años de experiencia.",
  },
  {
    image: equipo2,
    name: "María Rodríguez",
    role: "Instructora",
    description:
      "Experta en Pilates Mat y bienestar integral. Apasionada por el movimiento consciente.",
  },
  {
    image: equipo3,
    name: "Elena Martínez",
    role: "Instructora",
    description:
      "Especialista en Pilates para rehabilitación y postura. Enfoque en el cuidado personal.",
  },
];

const spaceFeatures = [
  {
    icon: solIcon,
    title: "Luz natural",
  },
  {
    icon: ambienteIcon,
    title: "Ambiente tranquilo",
  },
  {
    icon: posturaIcon,
    title: "Equipamiento de calidad",
  },
  {
    icon: candadoIcon,
    title: "Espacios seguros y limpios",
  },
];

export function AboutPage() {
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
                Sobre nosotros
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-tight text-textPrimary lg:text-7xl">
                Más que ejercicio,
                <br />
                un <span className="text-primary">estilo de vida</span>
              </h1>

              <img
                src={joseph}
                alt=""
                className="mt-6 h-12 object-contain opacity-70"
              />

              <p className="mt-8 max-w-[520px] text-lg leading-9 text-textSecondary">
                En Bella Pilates creemos en el poder del movimiento consciente
                para transformar cuerpo y mente.
              </p>

              <p className="mt-5 max-w-[520px] text-lg leading-9 text-textSecondary">
                Nuestro propósito es acompañarte en tu bienestar integral a
                través del Pilates, en un espacio acogedor, profesional y
                pensado para ti.
              </p>
            </div>

            <div className="group overflow-hidden rounded-[40px] shadow-soft">
              <img
                src={heroImage}
                alt="Centro Bella Pilates"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1400px] rounded-[38px] bg-[#F7EFE8] px-8 py-10 shadow-soft">
            <div className="text-center">
              <h2 className="text-4xl font-medium text-textPrimary">
                En lo que creemos
              </h2>

              <img
                src={joseph}
                alt=""
                className="mx-auto mt-2 h-8 object-contain opacity-70"
              />
            </div>

            <div className="mt-9 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {values.map((item, index) => (
                <article
                  key={item.title}
                  className={`text-center transition duration-300 hover:-translate-y-1 ${
                    index !== values.length - 1
                      ? "xl:border-r border-[#E9D8C8]"
                      : ""
                  }`}
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-primary/60 bg-[#FCFAF8]">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-12 w-12 object-contain"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-medium text-textPrimary">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-[230px] text-sm leading-7 text-textSecondary">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1400px] rounded-[42px] bg-[#F7EFE8] px-6 py-12 shadow-soft sm:px-10">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Nuestro equipo
              </p>

              <h2 className="mt-4 text-4xl font-medium text-textPrimary">
                Profesionales apasionadas por tu bienestar
              </h2>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {team.map((member) => (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-[30px] bg-[#FCFAF8] shadow-soft transition duration-300 hover:-translate-y-2"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-[310px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-7">
                    <h3 className="text-2xl font-medium text-primary">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm text-textSecondary">
                      {member.role}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-textPrimary">
                      {member.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[38px] bg-[#F7EFE8] shadow-soft lg:grid-cols-[1fr_1.4fr]">
            <div className="group overflow-hidden">
              <img
                src={espacioImage}
                alt="Espacio Bella Pilates"
                className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-full"
              />
            </div>

            <div className="relative px-8 py-10 sm:px-10 lg:px-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Nuestro espacio
              </p>

              <h2 className="mt-3 text-4xl font-medium leading-tight text-textPrimary">
                Un lugar pensado para ti
              </h2>

              <p className="mt-4 max-w-[650px] text-sm leading-7 text-textSecondary">
                Luz natural, ambiente tranquilo y cada detalle diseñado para que
                te sientas bien desde que llegas.
              </p>

              <div className="mt-8 grid max-w-[700px] grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
                {spaceFeatures.map((item) => (
                  <div key={item.title} className="text-center">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="mx-auto h-10 w-10 object-contain"
                    />

                    <p className="mt-3 text-sm font-medium leading-6 text-textPrimary">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/contact">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Ven a conocernos <span className="ml-2">→</span>
                  </button>
                </Link>
              </div>

              <img
                src={joseph}
                alt=""
                className="pointer-events-none absolute right-8 top-10 hidden h-40 w-40 object-contain opacity-25 lg:block"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 rounded-[34px] bg-[#F7EFE8] px-8 py-8 shadow-soft lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/60 bg-[#FCFAF8]">
                <img src={posturaIcon} alt="" className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-medium text-textPrimary">
                  Empieza hoy tu camino hacia el bienestar.
                </h2>

                <p className="mt-2 text-sm text-textSecondary">
                  Te acompañamos en cada paso del camino.
                </p>
              </div>
            </div>

            <Link to="/schedules">
              <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                Ver horarios y clases <span className="ml-2">→</span>
              </button>
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
