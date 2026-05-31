import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, X } from "lucide-react";

import logo from "../assets/logo.svg";

import { Button } from "./ui/Button";
import { LoginModal } from "./auth/LoginModal";
import { useAuth } from "../hooks/useAuth";

import { useScrollDirection } from "../hooks/useScrollDirection";

export function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isNavbarVisible = useScrollDirection();
  const { user, logout, isAuthenticated } = useAuth();

  const location = useLocation();

  const navLinkClass = (path) =>
    `relative text-sm font-medium transition ${
      location.pathname === path
        ? "text-primary after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-primary"
        : "text-textPrimary hover:text-primary"
    }`;

  return (
    <>
      <header
        className={` fixed left-0 right-0 top-4 z-50 px-4 sm:px-6 lg:px-10 transition-all duration-500 ${isNavbarVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"}`}
      >
        <nav className="mx-auto flex h-16 w-full min-w-0 max-w-[1500px] items-center justify-between rounded-full bg-white/95 px-4 shadow-soft backdrop-blur-md sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              src={logo}
              alt="Bella Pilates"
              className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
            />

            <span className="truncate text-xl font-medium text-textPrimary sm:text-2xl lg:text-[2rem]">
              Bella Pilates
            </span>
          </Link>

          <div className="hidden items-center gap-8 xl:flex">
            <Link to="/" className={navLinkClass("/")}>
              Inicio
            </Link>

            <Link to="/classes" className={navLinkClass("/classes")}>
              Clases
            </Link>

            <Link to="/schedules" className={navLinkClass("/schedules")}>
              Horarios
            </Link>

            <Link to="/plans" className={navLinkClass("/plans")}>
              Tarifas
            </Link>

            <Link to="/contact" className={navLinkClass("/contact")}>
              Contacto
            </Link>
            
            <Link to="/about" className={navLinkClass("/about")}>
              Sobre nosotros
            </Link>            
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium text-textPrimary lg:block">
                  Hola, {user?.name}
                </span>

                <Button variant="secondary" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryHover"
              >
                <User size={16} />
                Iniciar sesión
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-textPrimary md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="mx-auto mt-3 w-full max-w-[1500px] rounded-[28px] bg-white/95 p-5 shadow-soft backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium text-textPrimary">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
              <Link to="/classes" onClick={() => setIsMenuOpen(false)}>
                Clases
              </Link>
              <Link to="/schedules" onClick={() => setIsMenuOpen(false)}>
                Horarios
              </Link>
              <Link to="/plans" onClick={() => setIsMenuOpen(false)}>
                Tarifas
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                Sobre nosotros
              </Link>              

              <div className="pt-2">
                {isAuthenticated ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Cerrar sesión
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Iniciar sesión
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
