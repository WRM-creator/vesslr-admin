import type { ButtonHTMLAttributes } from "react";

type Variant = "default" | "ghost" | "danger" | "outline" | "destructive";
type Size = "xs" | "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** some pages pass tone=...; we map it to variant where sensible */
  tone?: "danger" | "err";
};

export default function Button({
  className = "",
  variant = "default",
  size = "md",
  tone,
  ...rest
}: Props) {
  // map tone aliases
  if ((tone === "danger" || tone === "err") && variant === "default") {
    variant = "danger";
  }

  const base =
    "rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-vesslr-ring disabled:opacity-60";

  const sizeCls: Record<Size, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-2.5",
  };

  const variantCls: Record<Variant, string> = {
    default: "bg-black text-white hover:bg-black/90",
    ghost:
      "bg-transparent border border-vesslr-border text-vesslr-ink hover:bg-black/5",
    danger: "bg-red-600 text-white hover:bg-red-700",
    destructive: "bg-red-600 text-white hover:bg-red-700", // alias of danger
    outline:
      "bg-transparent border border-vesslr-border text-vesslr-ink hover:bg-black/5",
  };

  return (
    <button
      className={`${base} ${sizeCls[size]} ${variantCls[variant]} ${className}`}
      {...rest}
    />
  );
}
