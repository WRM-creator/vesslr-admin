import type { PropsWithChildren, ReactNode } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-xl border border-vesslr-border bg-white/95 shadow-sm">
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  // allow either structured header props or raw children
  if (children && (title || subtitle || actions)) {
    return (
      <div className="px-4 py-3 border-b border-vesslr-border">
        {children}
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-vesslr-border flex items-center justify-between gap-3">
      <div className="min-w-0">
        {title && <div className="text-base font-semibold truncate">{title}</div>}
        {subtitle && (
          <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ children }: PropsWithChildren) {
  return <div className="px-4 py-4">{children}</div>;
}
