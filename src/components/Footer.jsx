import { Link } from "react-router-dom";

import logo from "../assets/logo.svg";
import instagram from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import whatsapp from "../assets/whatsapp.svg";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#E8DCCF] bg-[#F7F0EA]">
      <div className="w-full px-8 py-10 lg:px-20 xl:px-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Bella Pilates"
                className="h-12 w-12 object-contain"
              />

              <span className="text-[32px] font-medium text-textPrimary">
                Bella Pilates
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-textSecondary">
              Respira, conecta y renueva.
            </p>

            <p className="text-xs leading-5 text-textSecondary">
              Más que ejercicio, un estilo de vida.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Navegación
            </h3>

            <div className="grid grid-cols-2 gap-y-2 text-xs text-textSecondary">
              <Link to="/" className="transition hover:text-primary">
                Inicio
              </Link>

              <Link
                to="/about"
                className="transition hover:text-primary"
              >
                Sobre nosotros
              </Link>

              <Link
                to="/classes"
                className="transition hover:text-primary"
              >
                Clases
              </Link>

              <Link
                to="/schedules"
                className="transition hover:text-primary"
              >
                Horarios
              </Link>

              <Link
                to="/plans"
                className="transition hover:text-primary"
              >
                Tarifas
              </Link>

              <Link
                to="/contact"
                className="transition hover:text-primary"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Legal
            </h3>

            <div className="space-y-2 text-xs text-textSecondary">
              <Link
                to="/terms"
                className="block transition hover:text-primary"
              >
                Términos y condiciones
              </Link>

              <Link
                to="/privacy"
                className="block transition hover:text-primary"
              >
                Política de privacidad
              </Link>

              <Link
                to="/cookies"
                className="block transition hover:text-primary"
              >
                Política de cookies
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Síguenos
            </h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE4D8] transition hover:scale-105 hover:bg-primary"
              >
                <img
                  src={instagram}
                  alt="Instagram"
                  className="h-5 w-5"
                />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE4D8] transition hover:scale-105 hover:bg-primary"
              >
                <img
                  src={facebook}
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE4D8] transition hover:scale-105 hover:bg-primary"
              >
                <img
                  src={whatsapp}
                  alt="WhatsApp"
                  className="h-5 w-5"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E8DCCF] pt-4 text-center text-[11px] text-textSecondary">
          © 2026 Bella Pilates. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}