import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export default function Input({ className = "", label, ...rest }: Props) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-sm text-vesslr-mutd">{label}</span>}
      <input
        className={`rounded-md bg-white/95 border border-vesslr-border px-3 py-2 focus:ring-vesslr-ring focus:border-vesslr-ring ${className}`}
        {...rest}
      />
    </label>
  );
}
