import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface TransactionStatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: TINT.green,
  warning: TINT.amber,
  danger: TINT.red,
  info: TINT.blue,
  neutral: TINT.gray,
};

export function StatusBadge({
  status,
  variant = "neutral",
  className,
}: TransactionStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize transition-colors",
        variantStyles[variant],
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
