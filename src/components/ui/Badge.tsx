import type { ReactNode } from "react";

type Tone =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "info"
  | "blue"
  | "neutral"
  | "ok"
  | "warn"
  | "err";

type Props = {
  children: ReactNode;
  /** preferred prop */
  variant?: Tone;
  /** alias used in pages */
  tone?: Tone;
  className?: string;
};

export default function Badge({ children, variant, tone, className = "" }: Props) {
  const key: Tone = (tone || variant || "default");

  const map: Record<Tone, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger:  "bg-red-100 text-red-800",
    muted:   "bg-gray-50 text-gray-600",
    info:    "bg-sky-100 text-sky-800",
    blue:    "bg-blue-100 text-blue-800",
    neutral: "bg-slate-100 text-slate-800",
    ok:      "bg-green-100 text-green-800",
    warn:    "bg-yellow-100 text-yellow-800",
    err:     "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[key]} ${className}`}>
      {children}
    </span>
  );
}
