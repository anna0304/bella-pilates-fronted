import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.svg";
import pluma from "../../assets/pluma.svg";

import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getLoginErrorMessage(error) {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;
  const backendErrors = error?.response?.data?.errors;

  if (backendErrors?.email?.[0]) {
    return "Correo electrónico o contraseña incorrectos.";
  }

  if (backendErrors?.password?.[0]) {
    return "La contraseña no es válida.";
  }

  if (status === 401 || status === 422) {
    return "Correo electrónico o contraseña incorrectos.";
  }

  if (status === 403) {
    return backendMessage || "Tu cuenta está inactiva. Contacta con el centro.";
  }

  return backendMessage || "No se pudo iniciar sesión. Inténtalo nuevamente.";
}

export function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setError("");
    setShowPassword(false);
    onClose();
  }

  function validateForm() {
    const cleanEmail = email.trim();

    if (!cleanEmail && !password) {
      return "El correo electrónico y la contraseña son obligatorios.";
    }

    if (!cleanEmail) {
      return "El correo electrónico es obligatorio.";
    }

    if (!isValidEmail(cleanEmail)) {
      return "Introduce un correo electrónico válido.";
    }

    if (!password) {
      return "La contraseña es obligatoria.";
    }

    return "";
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login(email.trim(), password);

      localStorage.setItem("bella_pilates_token", response.token);
      localStorage.setItem("bella_pilates_user", JSON.stringify(response.user));

      handleClose();

      const role = response.user?.role?.toLowerCase();

      if (role === "admin" || role === "administrador") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[440px] rounded-[32px] bg-gradient-to-b from-[#FFF8F2] to-[#F8EFE7] px-10 py-9 shadow-soft">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft transition hover:bg-white"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <img
            src={logo}
            alt="Bella Pilates"
            className="mx-auto mb-2 h-16 w-216 object-contain"
          />

          <h2 className="text-3xl font-medium tracking-tight text-textPrimary">
            Bella Pilates
          </h2>

          <p className="mt-1 text-sm text-primary">
            Respira, conecta y renueva
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3" noValidate>
          <div>
            <label className="mb-2 block text-sm font-medium text-textPrimary">
              Correo electrónico
            </label>

            <div className="flex items-center gap-3 rounded-full border border-borderColor bg-white/40 px-4 py-2.5 text-textSecondary">
              <Mail size={20} />

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Ingresa tu correo"
                autoComplete="email"
                className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-textPrimary">
              Contraseña
            </label>

            <div className="flex items-center gap-3 rounded-full border border-borderColor bg-white/40 px-4 py-3 text-textSecondary">
              <Lock size={20} />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-muted"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-textSecondary transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="rounded-[22px] border border-borderColor bg-white/45 px-5 py-4 text-center">
            <p className="text-sm font-medium text-textPrimary">
              ¿Olvidaste tu contraseña?
            </p>

            <p className="mt-2 text-xs leading-6 text-textSecondary">
              Por seguridad, comunícate con el centro para que el administrador
              pueda restablecerla manualmente.
            </p>
          </div>

          {error && (
            <p className="rounded-2xl bg-dangerBg px-4 py-3 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-3 text-base shadow-soft"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
            <span>→</span>
          </Button>
        </form>

        <div className="mt-2 flex items-center gap-4">
          <div className="h-px flex-1 bg-borderColor" />
          <img src={pluma} alt="" className="h-6 w-6 opacity-60" />
          <div className="h-px flex-1 bg-borderColor" />
        </div>

        <p className="mt-2 text-center text-sm text-textSecondary">
          ¿Necesitas ayuda?{" "}
          <Link
            to="/contact"
            onClick={handleClose}
            className="font-medium text-primary hover:text-primaryHover"
          >
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  );
}