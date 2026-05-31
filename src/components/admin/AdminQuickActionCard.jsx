export function AdminQuickActionCard({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[120px] flex-col items-center justify-center gap-4 rounded-[18px] bg-[#FCF8F5] p-5 text-center transition hover:-translate-y-1 hover:shadow-sm"
    >
      <img src={icon} alt="" className="h-7 w-7" />
      <span className="text-sm font-semibold text-[#2F2118]">{label}</span>
    </button>
  );
}