import policyIcon from "../../assets/policy.svg";

export function ErrorState({
  title = "Algo salió mal",
  message = "No pudimos cargar la información. Inténtalo de nuevo.",
  actionText,
  onAction,
}) {
  return (
    <div className="rounded-[28px] border border-[#E8DDD3] bg-secondary p-10 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8E9DF]">
        <img src={policyIcon} alt="" className="h-10 w-10" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-[#2F2118]">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-[#6F5645]">{message}</p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}