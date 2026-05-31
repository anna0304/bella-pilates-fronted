export function ResetPasswordModal({ user, temporaryPassword, onClose }) {
  if (!user || !temporaryPassword) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(temporaryPassword);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-[520px] rounded-[28px] border border-[#E8DDD3] bg-secondary p-7 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2118]">
              Contraseña temporal
            </h2>

            <p className="mt-1 text-sm text-[#6F5645]">
              Entrega esta contraseña al usuario. Deberá cambiarla al iniciar sesión.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#6F5645]"
          >
            ×
          </button>
        </div>

        <div className="rounded-[20px] border border-[#E8DDD3] bg-white p-5">
          <p className="text-sm text-[#8B6B52]">Usuario</p>
          <p className="mt-1 font-semibold text-[#2F2118]">{user.name}</p>
          <p className="text-sm text-[#6F5645]">{user.email}</p>
        </div>

        <div className="mt-5 rounded-[20px] bg-[#FCF8F5] p-5 text-center">
          <p className="text-sm text-[#8B6B52]">Nueva contraseña</p>

          <p className="mt-3 text-3xl font-semibold tracking-wider text-[#2F2118]">
            {temporaryPassword}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-[14px] border border-[#E8DDD3] px-6 py-3 font-semibold text-primary"
          >
            Copiar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] bg-primary px-6 py-3 font-semibold text-white"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}