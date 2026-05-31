import { useEffect, useState } from "react";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { DashboardFooter } from "../../../components/user/DashboardFooter";
import { Button2 } from "../../../components/ui/Button2";
import { Toast } from "../../../components/ui/Toast";

import { getMe } from "../../../services/authService";
import { sendMessage } from "../../../services/messagesService";

import heroImage from "../../../assets/contact-hero.jpg";
import phoneIcon from "../../../assets/cell.svg";
import mailIcon from "../../../assets/mail.svg";
import locationIcon from "../../../assets/ubicacion.svg";
import calendarIcon from "../../../assets/horarios.svg";
import clockIcon from "../../../assets/reloj.svg";
import leafIcon from "../../../assets/niveles.svg";
import policyIcon from "../../../assets/policy.svg";
import arrowIcon from "../../../assets/flecha.svg";

const faqs = [
  "¿Cómo puedo reservar una clase?",
  "¿Puedo cancelar o modificar mi reserva?",
  "¿Qué nivel de Pilates necesito para empezar?",
  "¿Ofrecéis clases para embarazadas?",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
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
    }, 1800);
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();
        const user = response.user;

        setForm((currentForm) => ({
          ...currentForm,
          name: `${user?.name || ""} ${user?.surname || ""}`.trim(),
          email: user?.email || "",
          phone: user?.phone || "",
        }));
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    }

    loadUser();
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

    if (!form.subject.trim() || !form.message.trim()) {
      showToast("Completa asunto y mensaje");
      return;
    }

    try {
      setSendingMessage(true);

      await sendMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      });

      setForm((currentForm) => ({
        ...currentForm,
        subject: "",
        message: "",
      }));

      showToast("Mensaje enviado correctamente");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);

      const message =
        error?.response?.data?.message || "No se pudo enviar el mensaje";

      showToast(message);
    } finally {
      setSendingMessage(false);
    }
  };

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

          <section>
            <div className="grid gap-10 xl:grid-cols-[1fr_560px] xl:items-center">
              <div>
                <h1 className="text-5xl font-light text-[#2F2118]">
                  Contacto
                </h1>

                <div className="mt-6 flex w-fit items-center gap-3">
                  <span className="h-px w-16 bg-primary/40" />
                  <img src={leafIcon} alt="" className="h-8 w-8" />
                  <span className="h-px w-16 bg-primary/40" />
                </div>

                <div className="mt-12">
                  <h2 className="text-2xl font-semibold text-[#2F2118]">
                    Estamos aquí para ayudarte
                  </h2>

                  <p className="mt-4 max-w-lg leading-relaxed text-[#2F2118]">
                    Si tienes alguna duda, sugerencia o necesitas más
                    información sobre nuestras clases, escríbenos. Te
                    responderemos lo antes posible.
                  </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                  <ContactInfo icon={phoneIcon} title="Teléfono">
                    +34 600 123 456
                  </ContactInfo>

                  <ContactInfo icon={mailIcon} title="Email">
                    hola@bellapilates.com
                  </ContactInfo>

                  <ContactInfo icon={locationIcon} title="Dirección">
                    Calle Enriqueta Ortega, 17
                    <br />
                    03005 Alicante
                  </ContactInfo>
                </div>
              </div>

              <img
                src={heroImage}
                alt="Recepción Bella Pilates"
                className="h-[340px] w-full rounded-[28px] object-cover shadow-sm"
              />
            </div>

            <div className="mt-12 grid gap-8 xl:grid-cols-2">
              <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <img src={leafIcon} alt="" className="h-6 w-6" />
                  <h2 className="text-2xl font-semibold text-[#2F2118]">
                    Envíanos un mensaje
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputField
                    label="Nombre completo"
                    name="name"
                    value={form.name}
                    disabled
                  />

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                  />

                  <InputField
                    label="Teléfono"
                    name="phone"
                    value={form.phone || "No disponible"}
                    disabled
                  />

                  <div>
                    <label className="mb-2 block font-medium text-[#2F2118]">
                      Asunto *
                    </label>

                    <div className="relative">
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-[14px] border border-[#E8DDD3] bg-white px-5 py-4 outline-none focus:border-primary"
                      >
                        <option value="">¿En qué podemos ayudarte?</option>
                        <option value="Reservas">Reservas</option>
                        <option value="Clases grabadas">Clases grabadas</option>
                        <option value="Planes">Planes</option>
                        <option value="Otro">Otro</option>
                      </select>

                      <img
                        src={arrowIcon}
                        alt=""
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#2F2118]">
                      Mensaje *
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full resize-none rounded-[14px] border border-[#E8DDD3] bg-white p-5 outline-none focus:border-primary"
                    />
                  </div>

                  <Button2
                    variant="primary"
                    className="w-full"
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? "Enviando..." : "Enviar mensaje"}
                  </Button2>

                  <div className="flex items-start gap-3 text-sm text-[#6F5645]">
                    <img src={policyIcon} alt="" className="mt-1 h-5 w-5" />
                    <p>
                      Tus datos están seguros con nosotros.
                      <br />
                      Consulta nuestra política de privacidad.
                    </p>
                  </div>
                </form>
              </div>

              <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <img src={leafIcon} alt="" className="h-6 w-6" />
                  <h2 className="text-2xl font-semibold text-[#2F2118]">
                    Dónde estamos
                  </h2>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-[#E8DDD3]">
                  <iframe
                    title="Ubicación Bella Pilates"
                    src="https://www.google.com/maps?q=Calle+Enriqueta+Ortega+17+Alicante&output=embed"
                    className="h-[360px] w-full border-0"
                    loading="lazy"
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-primary">
                    Bella Pilates
                  </h3>

                  <p className="mt-4 leading-relaxed text-[#2F2118]">
                    Calle Enriqueta Ortega, 17
                    <br />
                    03005 Alicante, España
                  </p>

                  <Button2 variant="outline" className="mt-8">
                    Cómo llegar →
                  </Button2>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <img src={calendarIcon} alt="" className="h-6 w-6" />
                  <h2 className="text-2xl font-semibold text-[#2F2118]">
                    Horarios de atención
                  </h2>
                </div>

                <div className="space-y-5 text-[#2F2118]">
                  <div className="flex justify-between">
                    <span className="font-semibold">Lunes a Viernes</span>
                    <span>9:00 - 20:00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold">Sábado</span>
                    <span>9:00 - 14:00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold">Domingo</span>
                    <span>Cerrado</span>
                  </div>
                </div>

                <div className="mt-36 flex items-center gap-4 rounded-[18px] bg-[#FCF8F5] p-5">
                  <img src={clockIcon} alt="" className="h-9 w-9" />
                  <p className="text-sm text-[#2F2118]">
                    Nuestro equipo te responderá durante el horario de atención.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <img src={leafIcon} alt="" className="h-6 w-6" />
                  <h2 className="text-2xl font-semibold text-[#2F2118]">
                    Preguntas frecuentes
                  </h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;

                    return (
                      <div
                        key={faq}
                        className="overflow-hidden rounded-[14px] border border-[#E8DDD3] bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left text-[#2F2118]"
                        >
                          <span>{faq}</span>

                          <img
                            src={arrowIcon}
                            alt=""
                            className={`h-4 w-4 transition duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="border-t border-[#E8DDD3] px-5 py-4">
                            <p className="text-sm leading-relaxed text-[#6F5645]">
                              Puedes escribirnos desde el formulario de contacto
                              o comunicarte directamente con el estudio. Nuestro
                              equipo estará encantado de ayudarte.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-6 text-sm text-[#2F2118]">
                  ¿No encuentras lo que buscas? Escríbenos y estaremos
                  encantados de ayudarte.
                </p>
              </div>
            </div>
          </section>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}

function ContactInfo({ icon, title, children }) {
  return (
    <div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE5DD]">
        <img src={icon} alt="" className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-semibold text-[#2F2118]">{title}</h3>

      <p className="mt-1 text-sm text-[#2F2118]">{children}</p>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block font-medium text-[#2F2118]">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-[14px] border border-[#E8DDD3] px-5 py-4 outline-none ${
          disabled
            ? "bg-[#F5F1EC] text-[#6F5645]"
            : "bg-white focus:border-primary"
        }`}
      />
    </div>
  );
}