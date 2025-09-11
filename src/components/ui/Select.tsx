import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className = "", label, children, ...rest },
  ref
) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-sm text-vesslr-mutd">{label}</span>}
      <select
        ref={ref}
        className={`rounded-md bg-white/95 border border-vesslr-border px-3 py-2 focus:ring-vesslr-ring focus:border-vesslr-ring ${className}`}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
});

export default Select;
