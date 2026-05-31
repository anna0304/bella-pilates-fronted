import footerLeaf from "../../assets/joseph.jpg";
import instagramIcon from "../../assets/instagram.svg";
import facebookIcon from "../../assets/facebook.svg";
import whatsappIcon from "../../assets/whatsapp.svg";

export function DashboardFooter() {
  return (
    <footer className="mt-10 border-t border-[#E8DDD3] bg-secondary px-4 py-6 lg:px-8 lg:py-0">
      <div className="flex flex-col items-center gap-6 text-center lg:min-h-[86px] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
        {/* IZQUIERDA */}
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
          <img
            src={footerLeaf}
            alt=""
            className="h-14 w-auto object-contain opacity-70 lg:h-16"
          />

          <p className="max-w-[240px] font-josefin text-sm leading-relaxed text-[#6F5645] lg:max-w-none">
            © 2026 Bella Pilates. Todos los derechos reservados.
          </p>
        </div>

        {/* CENTRO */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#6F5645] lg:flex-nowrap lg:gap-5">
          <a href="#" className="font-josefin hover:text-primary">
            Política de privacidad
          </a>

          <span className="hidden text-[#D6C6B7] lg:block">|</span>

          <a href="#" className="font-josefin hover:text-primary">
            Términos y condiciones
          </a>

          <span className="hidden text-[#D6C6B7] lg:block">|</span>

          <a href="#" className="font-josefin hover:text-primary">
            Soporte
          </a>

          <span className="hidden text-[#D6C6B7] lg:block">|</span>

          <a href="#" className="font-josefin hover:text-primary">
            Contacto
          </a>
        </nav>

        {/* DERECHA */}
        <div className="flex items-center gap-5">
          <img
            src={instagramIcon}
            alt="Instagram"
            className="h-6 w-6 cursor-pointer transition hover:opacity-70"
          />

          <img
            src={facebookIcon}
            alt="Facebook"
            className="h-6 w-6 cursor-pointer transition hover:opacity-70"
          />

          <img
            src={whatsappIcon}
            alt="WhatsApp"
            className="h-6 w-6 cursor-pointer transition hover:opacity-70"
          />
        </div>
      </div>
    </footer>
  );
}