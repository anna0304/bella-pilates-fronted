import { Link } from "react-router-dom";

import heroImage from "../../assets/hero-pilates.jpg";
import posturaIcon from "../../assets/postura.svg";
import estresIcon from "../../assets/estres.svg";
import flexibilidadIcon from "../../assets/flexibilidad.svg";
import bienestarIcon from "../../assets/bienestar.svg";
import mat from "../../assets/mat.jpg";
import reformer from "../../assets/reformer.jpg";
import flow from "../../assets/flow.jpg";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import joseph from "../../assets/joseph.jpg";
import jarron from "../../assets/jarron.jpg";

import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";

const benefits = [
  {
    icon: posturaIcon,
    title: "Mejora tu postura",
    description: "Fortalece tu espalda y alinea tu cuerpo.",
  },
  {
    icon: estresIcon,
    title: "Reduce el estrés",
    description: "Conecta con tu respiración y encuentra calma.",
  },
  {
    icon: flexibilidadIcon,
    title: "Aumenta tu flexibilidad",
    description: "Movimientos controlados que mejoran tu movilidad.",
  },
  {
    icon: bienestarIcon,
    title: "Bienestar integral",
    description: "Cuerpo fuerte, mente clara y energía renovada.",
  },
];

const featuredClasses = [
  {
    image: reformer,
    title: "Pilates Reformer",
    subtitle: "Fuerza · Control · Precisión",
  },
  {
    image: mat,
    title: "Pilates Mat",
    subtitle: "Flexibilidad · Equilibrio · Conexión",
  },
  {
    image: flow,
    title: "Pilates Flow",
    subtitle: "Energía · Fluidez · Bienestar",
  },
];

export function HomePage() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-background">
        <img
          src={heroImage}
          alt="Clase de pilates"
          className="
            absolute inset-0 h-full w-full object-cover
            object-[62%_center]
            sm:object-[58%_center]
            lg:object-center
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-b from-[#FBF8F5]/95 via-[#FBF8F5]/50 to-[#FBF8F5]/10
            md:bg-gradient-to-r md:from-[#FBF8F5]/100 md:via-[#FBF8F5]/35 md:to-transparent
            lg:via-[#FBF8F5]/15
          "
        />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-5 pt-28 sm:px-8 lg:px-10 lg:pt-24">
          <Reveal>
            <div className="max-w-[620px] -mt-6 sm:-mt-10 lg:-mt-14">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary sm:mb-5 sm:text-sm">
                Bella Pilates
              </p>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-textPrimary sm:text-6xl lg:text-7xl">
                Respira, conecta
                <br />y <span className="text-primary">renueva</span>
              </h1>

              <p className="mt-6 max-w-[480px] text-base leading-7 text-textPrimary sm:mt-8 sm:text-lg sm:leading-8">
                Más que ejercicio, un estilo de vida.
                <br />
                Equilibrio para tu cuerpo y mente.
              </p>

              <div className="mt-8">
                <Link to="/classes">
                  <Button className="px-8">
                    Ver clases <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-[-55px] left-0 right-0 z-20 flex justify-center overflow-hidden">
          <div className="relative h-[120px] w-[115%] overflow-hidden rounded-t-[80px] bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="absolute inset-x-0 top-0 h-[18px] animate-[softWave_7s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md" />
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden bg-background px-5 pb-20 pt-24 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] animate-[backgroundFlow_18s_ease-in-out_infinite] rounded-full bg-[#DCC5B0] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[420px] animate-[backgroundFlowReverse_20s_ease-in-out_infinite] rounded-full bg-[#E9D8C8] blur-[120px]" />
        </div>

        <Reveal>
          <div className="relative z-10 mx-auto max-w-[1300px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Beneficios del Pilates
            </p>

            <h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight text-textPrimary sm:text-4xl lg:text-5xl">
              Transforma tu cuerpo
              <br />y tu <span className="text-primary">bienestar</span>
            </h2>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="group flex flex-col items-center text-center transition duration-300 hover:-translate-y-2"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary transition duration-300 group-hover:scale-110">
                    <img
                      src={benefit.icon}
                      alt={benefit.title}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-textPrimary">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 max-w-[210px] text-sm leading-6 text-textSecondary">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-background px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-[1350px] rounded-[56px] bg-[#FCFAF8] px-6 py-14 sm:px-10 lg:px-14">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Clases destacadas
              </p>

              <h2 className="mt-4 text-3xl font-medium tracking-tight text-textPrimary sm:text-4xl lg:text-5xl">
                Encuentra tu clase favorita
              </h2>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {featuredClasses.map((classItem) => (
                <article
                  key={classItem.title}
                  className="group overflow-hidden rounded-[34px] bg-surface shadow-soft transition duration-300 hover:-translate-y-2"
                >
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="relative px-6 pb-6 pt-7">
                    <div className="absolute -top-8 left-6 flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#FCFAF8] bg-secondary shadow-sm">
                      <img
                        src={posturaIcon}
                        alt=""
                        className="h-8 w-8 object-contain"
                      />
                    </div>

                    <h3 className="text-2xl font-medium text-textPrimary">
                      {classItem.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-primary">
                      {classItem.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link to="/classes">
                <button className="rounded-full px-8 py-4 text-sm font-medium text-textPrimary transition hover:bg-primary hover:text-white">
                  Ver todas las clases
                </button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1350px] gap-6 rounded-[48px] bg-[#F7EFE8] p-6 lg:grid-cols-[1fr_1.2fr_1fr_1fr] lg:items-center">
            <div className="px-2 py-6 lg:px-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Conoce nuestro centro
              </p>

              <h2 className="mt-4 text-3xl font-medium leading-tight text-textPrimary sm:text-4xl">
                Un espacio creado
                <br />
                para ti
              </h2>

              <p className="mt-4 max-w-[320px] text-sm leading-6 text-textSecondary">
                En Bella Pilates hemos diseñado un ambiente acogedor y elegante
                donde cada detalle está pensado para tu bienestar.
              </p>

              <Link to="/about">
                <button className="mt-6 rounded-full bg-secondary px-8 py-4 text-sm font-medium text-textPrimary transition hover:bg-primary hover:text-white">
                  Conócenos más
                </button>
              </Link>
            </div>

            {[img1, img2, img3].map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Centro Bella Pilates ${index + 1}`}
                className="h-[220px] w-full rounded-[24px] object-cover transition duration-500 hover:scale-[1.03] lg:h-[250px]"
              />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto flex max-w-[1350px] items-center justify-between overflow-hidden rounded-[42px] bg-[#F7EFE8] px-8 py-8 sm:px-10 lg:px-16">
            <div className="hidden lg:block">
              <span className="text-[140px] font-serif leading-none text-primary/70">
                “
              </span>
            </div>

            <div className="flex-1 text-center">
              <p className="text-xl italic leading-relaxed text-textPrimary sm:text-2xl">
                El movimiento es la canción del cuerpo.
                <br />
                El Pilates es el ritmo que convierte la mente en armonía.
              </p>

              <p className="mt-4 text-sm font-semibold text-textPrimary">
                — Joseph Pilates
              </p>
            </div>

            <div className="hidden lg:block">
              <img
                src={joseph}
                alt="Joseph Pilates"
                className="h-[180px] w-[180px] object-contain opacity-80"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1350px] overflow-hidden rounded-[42px] bg-[#F7EFE8] shadow-soft lg:grid-cols-[420px_1fr]">
            <div className="h-[220px] lg:h-full">
              <img
                src={jarron}
                alt="Bienestar Bella Pilates"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-center px-8 py-10 sm:px-10 lg:px-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Tarifas flexibles
              </p>

              <h2 className="mt-3 text-3xl font-medium leading-tight text-textPrimary sm:text-4xl">
                Elige tu plan ideal
              </h2>

              <div className="mt-5 space-y-3">
                {[
                  "Planes adaptados a ti",
                  "Acceso a clases presenciales y grabadas",
                  "Flexibilidad y comodidad",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
                      ✓
                    </div>

                    <p className="text-sm text-textSecondary">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/plans">
                  <button className="rounded-full bg-secondary px-8 py-4 text-sm font-medium text-textPrimary transition hover:bg-primary hover:text-white">
                    Ver tarifas
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}