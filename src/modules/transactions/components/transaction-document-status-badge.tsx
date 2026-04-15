import { StatusBadge, type StatusVariant } from "@/components/shared/status-badge";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

const statusConfig: Record<string, { variant: StatusVariant; icon: React.ReactNode; label: string }> = {
  APPROVED: { variant: "success", icon: <CheckCircle2 className="size-3" />, label: "Approved" },
  REJECTED: { variant: "danger", icon: <AlertCircle className="size-3" />, label: "Rejected" },
  SUBMITTED: { variant: "info", icon: <FileText className="size-3" />, label: "Submitted" },
};

const defaultConfig = { variant: "neutral" as StatusVariant, icon: <Clock className="size-3" />, label: "Pending" };

interface TransactionDocumentStatusBadgeProps {
  status: string;
}

export function TransactionDocumentStatusBadge({
  status,
}: TransactionDocumentStatusBadgeProps) {
  const config = statusConfig[status] ?? defaultConfig;
  return (
    <StatusBadge
      status={config.label}
      variant={config.variant}
    />
  );
}
