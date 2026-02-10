import { Badge } from "@/components/ui/badge";
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
  success: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  neutral: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
};

// TODO: Convert this to a general status badge

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
