import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, FileUp } from "lucide-react";

export type ComplianceDocumentStatus =
  | "pending"
  | "uploaded"
  | "verified"
  | "rejected";

interface TransactionComplianceBadgeProps {
  status: ComplianceDocumentStatus;
}

export function TransactionComplianceBadge({
  status,
}: TransactionComplianceBadgeProps) {
  switch (status) {
    case "verified":
      return (
        <Badge className="gap-1.5 border-green-200 bg-green-500/15 pr-2.5 pl-1.5 text-green-700 hover:bg-green-500/25">
          <CheckCircle className="h-3.5 w-3.5" />
          Verified
        </Badge>
      );
    case "uploaded":
      return (
        <Badge className="gap-1.5 border-blue-200 bg-blue-500/15 pr-2.5 pl-1.5 text-blue-700 hover:bg-blue-500/25">
          <FileUp className="h-3.5 w-3.5" />
          Review Required
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="destructive"
          className="gap-1.5 border-red-200 bg-red-500/15 pr-2.5 pl-1.5 text-red-700 hover:bg-red-500/25"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge
          variant="secondary"
          className="text-muted-foreground gap-1.5 pr-2.5 pl-1.5"
        >
          <Clock className="h-3.5 w-3.5" />
          Pending
        </Badge>
      );
  }
}
