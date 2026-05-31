import { useState } from "react";
import { Link } from "react-router-dom";

import { sendMessage } from "../../services/messagesService";

import heroImage from "../../assets/contact-hero.jpg";
import studioImage from "../../assets/contact-studio.jpg";
import ctaImage from "../../assets/jarron.jpg";

import joseph from "../../assets/joseph.jpg";
import cellIcon from "../../assets/cell.svg";
import mailIcon from "../../assets/mail.svg";
import ubicacionIcon from "../../assets/ubicacion.svg";
import relojIcon from "../../assets/reloj.svg";
import arrowIcon from "../../assets/flecha.svg";

import { Reveal } from "../../components/ui/Reveal";
import { Toast } from "../../components/ui/Toast";

const contactCards = [
  {
    icon: cellIcon,
    title: "Teléfono",
    text: "+34 600 123 456",
  },
  {
    icon: mailIcon,
    title: "Email",
    text: "hola@bellapilates.com",
  },
  {
    icon: ubicacionIcon,
    title: "Dirección",
    text: "Calle Enriqueta Ortega 17, Alicante",
  },
  {
    icon: relojIcon,
    title: "Horarios de atención",
    text: "Lun - Vie: 7:00 - 21:00 · Sáb: 8:00 - 14:00",
  },
];

const faqs = [
  {
    question: "¿Necesito experiencia previa para empezar?",
    answer:
      "No. Tenemos clases para principiantes y nuestras profesoras adaptan los ejercicios a tu nivel.",
  },
  {
    question: "¿Puedo cancelar o modificar mi reserva?",
    answer:
      "Sí. Puedes cancelar tu reserva hasta 12 horas antes del inicio de la clase sin penalización.",
  },
  {
    question: "¿Hay clases para principiantes?",
    answer:
      "Sí. Contamos con clases de iniciación para que puedas empezar de forma segura y progresiva.",
  },
  {
    question: "¿Qué debo llevar a mi primera clase?",
    answer:
      "Te recomendamos venir con ropa cómoda, calcetines antideslizantes y una botella de agua.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState(initialForm);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
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
    }, 2000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      showToast("Completa todos los campos obligatorios");
      return;
    }

    try {
      setSending(true);

      await sendMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      });

      setForm(initialForm);
      showToast("Mensaje enviado correctamente");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);

      const message =
        error?.response?.data?.message || "No se pudo enviar el mensaje";

      showToast(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[#F3E8DE] pt-28">
      <Toast visible={toast.visible} message={toast.message} />

      <section className="relative overflow-hidden px-5 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] animate-[backgroundFlow_18s_ease-in-out_infinite] rounded-full bg-[#DCC5B0] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[440px] w-[440px] animate-[backgroundFlowReverse_20s_ease-in-out_infinite] rounded-full bg-[#E9D8C8] blur-[120px]" />
        </div>

        <Reveal>
          <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                Contacto
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-tight text-textPrimary lg:text-7xl">
                Estamos aquí
                <br />
                para <span className="text-primary">ayudarte</span>
              </h1>

              <img
                src={joseph}
                alt=""
                className="mt-6 h-12 object-contain opacity-70"
              />

              <p className="mt-8 max-w-[520px] text-lg leading-9 text-textSecondary">
                Si tienes alguna duda, sugerencia o necesitas más información
                sobre nuestras clases, escríbenos. Te responderemos lo antes
                posible.
              </p>

              <div className="mt-8">
                <a href="#contact-form">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Envíanos un mensaje <span className="ml-2">→</span>
                  </button>
                </a>
              </div>
            </div>

            <div className="group overflow-hidden rounded-[40px] shadow-soft">
              <img
                src={heroImage}
                alt="Recepción Bella Pilates"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] rounded-[38px] bg-[#F7EFE8] py-10 md:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((item, index) => (
              <article
                key={item.title}
                className={`px-8 text-center transition duration-300 hover:-translate-y-1 ${
                  index !== contactCards.length - 1
                    ? "xl:border-r border-[#E9D8C8]"
                    : ""
                }`}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <img src={item.icon} alt={item.title} className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-lg font-medium text-textPrimary">
                  {item.title}
                </h3>

                <p className="mx-auto mt-3 max-w-[220px] text-sm leading-7 text-textSecondary">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] items-stretch gap-8 lg:grid-cols-2">
          <Reveal>
            <article
              id="contact-form"
              className="flex h-full flex-col rounded-[34px] bg-[#F7EFE8] p-8 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <img src={joseph} alt="" className="h-10 w-10 object-contain" />
                <h2 className="text-3xl font-medium text-textPrimary">
                  Envíanos un mensaje
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-textPrimary">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Escribe tu nombre"
                      className="mt-2 w-full rounded-xl border border-[#E1CDBD] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-textPrimary">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Tu correo electrónico"
                      className="mt-2 w-full rounded-xl border border-[#E1CDBD] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-textPrimary">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Tu teléfono"
                      className="mt-2 w-full rounded-xl border border-[#E1CDBD] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-textPrimary">
                      Asunto *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-[#E1CDBD] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
                    >
                      <option value="">¿En qué podemos ayudarte?</option>
                      <option value="Información sobre clases">
                        Información sobre clases
                      </option>
                      <option value="Horarios y reservas">
                        Horarios y reservas
                      </option>
                      <option value="Planes y tarifas">Planes y tarifas</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-textPrimary">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Escribe tu mensaje aquí..."
                      className="mt-2 w-full resize-none rounded-xl border border-[#E1CDBD] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="mt-6 w-full rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Enviando..." : "Enviar mensaje →"}
                </button>

                <p className="mt-4 text-xs leading-6 text-textSecondary">
                  Tus datos están seguros con nosotros. Consulta nuestra política
                  de privacidad.
                </p>
              </form>
            </article>
          </Reveal>

          <Reveal>
            <article className="rounded-[34px] bg-[#F7EFE8] p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <img
                  src={ubicacionIcon}
                  alt=""
                  className="h-10 w-10 object-contain"
                />
                <h2 className="text-3xl font-medium text-textPrimary">
                  Dónde estamos
                </h2>
              </div>

              <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E9D8C8]">
                <iframe
                  title="Bella Pilates ubicación"
                  src="https://www.google.com/maps?q=Calle+Enriqueta+Ortega+17+Alicante+España&output=embed"
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-medium text-primary">
                  Bella Pilates
                </h3>

                <p className="mt-3 text-sm leading-7 text-textSecondary">
                  Calle Enriqueta Ortega 17
                  <br />
                  Alicante, España
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Calle+Enriqueta+Ortega+17+Alicante+España"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-full border border-primary px-8 py-4 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
                >
                  Cómo llegar <span className="ml-2">→</span>
                </a>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2">
          <Reveal>
            <article className="rounded-[34px] bg-[#F7EFE8] p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-primary">
                  ?
                </span>
                <h2 className="text-3xl font-medium text-textPrimary">
                  Preguntas frecuentes
                </h2>
              </div>

              <div className="mt-8 space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-xl border border-[#E1CDBD] bg-white/60"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-textPrimary"
                      >
                        <span>{faq.question}</span>

                        <img
                          src={arrowIcon}
                          alt=""
                          className={`h-4 w-4 transition duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#E1CDBD] px-5 py-4">
                          <p className="text-sm leading-6 text-textSecondary">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-sm text-textSecondary">
                ¿No encuentras lo que buscas? Escríbenos, estaremos encantados
                de ayudarte.
              </p>
            </article>
          </Reveal>

          <Reveal>
            <div className="group overflow-hidden rounded-[34px] shadow-soft">
              <img
                src={studioImage}
                alt="Estudio Bella Pilates"
                className="h-full min-h-[396px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F3E8DE] px-5 pb-24 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[34px] bg-[#F7EFE8] lg:grid-cols-[1fr_1.25fr]">
            <div className="group overflow-hidden">
              <img
                src={ctaImage}
                alt="Bienestar Bella Pilates"
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
                Descubre todo lo que el Pilates puede hacer por ti.
              </p>

              <div className="mt-8">
                <Link to="/schedules">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-primaryHover">
                    Ver horarios y clases <span className="ml-2">→</span>
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