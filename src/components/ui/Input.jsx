export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-textPrimary">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-borderColor bg-surface px-4 py-3 text-textPrimary outline-none transition placeholder:text-muted focus:border-primary"
      />
    </div>
  );
}