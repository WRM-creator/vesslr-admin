import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";

export enum TransactionStatus {
  INITIATED = "INITIATED",
  DOCUMENTS_SUBMITTED = "DOCUMENTS_SUBMITTED",
  COMPLIANCE_REVIEWED = "COMPLIANCE_REVIEWED",
  ESCROW_FUNDED = "ESCROW_FUNDED",
  LOGISTICS_ASSIGNED = "LOGISTICS_ASSIGNED",
  IN_TRANSIT = "IN_TRANSIT",
  INSPECTION_PENDING = "INSPECTION_PENDING",
  INSPECTION_UNDER_REVIEW = "INSPECTION_UNDER_REVIEW",
  INSPECTION_FAILED = "INSPECTION_FAILED",
  INSPECTION_PRICE_REVIEW = "INSPECTION_PRICE_REVIEW",
  MILESTONES_IN_PROGRESS = "MILESTONES_IN_PROGRESS",
  DELIVERY_CONFIRMED = "DELIVERY_CONFIRMED",
  SETTLEMENT_RELEASED = "SETTLEMENT_RELEASED",
  CLOSED = "CLOSED",
  DISPUTED = "DISPUTED",
  REFUNDED = "REFUNDED",
}

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface TransactionStatusBadgeProps {
  status: TransactionStatus | string;
  className?: string;
}

const statusToVariant: Record<string, StatusVariant> = {
  [TransactionStatus.INITIATED]: "neutral",
  [TransactionStatus.DOCUMENTS_SUBMITTED]: "info",
  [TransactionStatus.COMPLIANCE_REVIEWED]: "warning",
  [TransactionStatus.ESCROW_FUNDED]: "info",
  [TransactionStatus.LOGISTICS_ASSIGNED]: "info",
  [TransactionStatus.IN_TRANSIT]: "info",
  [TransactionStatus.INSPECTION_PENDING]: "warning",
  [TransactionStatus.INSPECTION_UNDER_REVIEW]: "info",
  [TransactionStatus.INSPECTION_FAILED]: "danger",
  [TransactionStatus.INSPECTION_PRICE_REVIEW]: "warning",
  [TransactionStatus.MILESTONES_IN_PROGRESS]: "info",
  [TransactionStatus.DELIVERY_CONFIRMED]: "success",
  [TransactionStatus.SETTLEMENT_RELEASED]: "success",
  [TransactionStatus.CLOSED]: "neutral",
  [TransactionStatus.DISPUTED]: "danger",
  [TransactionStatus.REFUNDED]: "warning",
};

const variantStyles: Record<StatusVariant, string> = {
  success: TINT.green,
  warning: TINT.amber,
  danger: TINT.red,
  info: TINT.blue,
  neutral: TINT.gray,
};

export function TransactionStatusBadge({
  status,
  className,
}: TransactionStatusBadgeProps) {
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
