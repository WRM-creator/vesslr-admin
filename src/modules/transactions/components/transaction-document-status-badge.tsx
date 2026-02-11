import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

interface TransactionDocumentStatusBadgeProps {
  status: string;
}

export function TransactionDocumentStatusBadge({
  status,
}: TransactionDocumentStatusBadgeProps) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="size-3" /> Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="border-red-200 bg-red-100 text-red-700 hover:bg-red-100">
          <AlertCircle className="size-3" /> Rejected
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100">
          <FileText className="size-3" /> Submitted
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="size-3" /> Pending
        </Badge>
      );
  }
}
