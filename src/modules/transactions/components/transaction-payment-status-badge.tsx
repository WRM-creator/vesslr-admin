import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export enum TransactionPaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  FUNDED = "FUNDED",
  RELEASED = "RELEASED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export type PaymentStatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface TransactionPaymentStatusBadgeProps {
  status: TransactionPaymentStatus | string;
  className?: string;
}

const statusToVariant: Record<string, PaymentStatusVariant> = {
  [TransactionPaymentStatus.PENDING]: "neutral",
  [TransactionPaymentStatus.PROCESSING]: "info",
  [TransactionPaymentStatus.FUNDED]: "success",
  [TransactionPaymentStatus.RELEASED]: "success",
  [TransactionPaymentStatus.FAILED]: "danger",
  [TransactionPaymentStatus.REFUNDED]: "warning",
};

const variantStyles: Record<PaymentStatusVariant, string> = {
  success: "bg-green-800 text-white border-green-800 hover:bg-green-900",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  neutral: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
};

export function TransactionPaymentStatusBadge({
  status,
  className,
}: TransactionPaymentStatusBadgeProps) {
  const variant = statusToVariant[status] || "neutral";

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize transition-colors",
        variantStyles[variant],
        className,
      )}
    >
      {status.toLowerCase().replace(/_/g, " ")}
    </Badge>
  );
}
