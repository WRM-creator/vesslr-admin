import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
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
  success: TINT.green,
  warning: TINT.amber,
  danger: TINT.red,
  info: TINT.blue,
  neutral: TINT.gray,
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
