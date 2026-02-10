import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export enum TransactionStatus {
  INITIATED = "INITIATED",
  DOCUMENTS_SUBMITTED = "DOCUMENTS_SUBMITTED",
  COMPLIANCE_REVIEW = "COMPLIANCE_REVIEW",
  ESCROW_FUNDED = "ESCROW_FUNDED",
  LOGISTICS_ASSIGNED = "LOGISTICS_ASSIGNED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERY_CONFIRMED = "DELIVERY_CONFIRMED",
  SETTLEMENT_RELEASED = "SETTLEMENT_RELEASED",
  CLOSED = "CLOSED",
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
  [TransactionStatus.COMPLIANCE_REVIEW]: "warning",
  [TransactionStatus.ESCROW_FUNDED]: "info",
  [TransactionStatus.LOGISTICS_ASSIGNED]: "info",
  [TransactionStatus.IN_TRANSIT]: "info",
  [TransactionStatus.DELIVERY_CONFIRMED]: "success",
  [TransactionStatus.SETTLEMENT_RELEASED]: "success",
  [TransactionStatus.CLOSED]: "neutral",
};

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  neutral: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
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
