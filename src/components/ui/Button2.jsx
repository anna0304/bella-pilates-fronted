export function Button2({
  children,
  variant = "outline",
  size = "md",
  className = "",
  icon,
  ...props
}) {
  const variants = {
    primary:
      "border border-primary bg-primary text-white hover:opacity-90",

    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",

    secondary:
      "bg-[#EFE1D4] text-[#2F2118] hover:opacity-90",
  };

  const sizes = {
    sm: "rounded-xl px-4 py-2 text-sm",
    md: "rounded-xl px-6 py-3 text-sm",
    lg: "rounded-2xl px-8 py-4 text-base",
    pill: "rounded-full px-7 py-3 text-sm",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          className="h-4 w-4"
        />
      )}

      {children}
    </button>
  );
}