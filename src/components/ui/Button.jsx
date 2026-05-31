import clsx from "clsx";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    secondary:
      "border border-borderColor bg-surface text-textPrimary hover:bg-secondary",
    ghost: "text-textPrimary hover:bg-secondary",
    danger: "bg-danger text-white hover:bg-dangerHover",
    success: "bg-success text-white hover:bg-successHover",
  };

  return (
    <button
      className={clsx(
        "rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}