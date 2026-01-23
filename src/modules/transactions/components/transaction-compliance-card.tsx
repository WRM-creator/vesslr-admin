import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle2, Clock, Eye, XCircle } from "lucide-react";
import type { TransactionDetails } from "../lib/transaction-details-model";

interface TransactionComplianceCardProps {
  compliance: TransactionDetails["compliance"];
}

export function TransactionComplianceCard({
  compliance,
}: TransactionComplianceCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="border-muted h-4 w-4 rounded-full border-2" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Verified
          </Badge>
        );
      case "submitted":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
          >
            Review Pending
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Missing</Badge>;
    }
  };

  const submittedCount = compliance.requiredDocuments.filter(
    (d) => d.status === "submitted" || d.status === "approved",
  ).length;
  const totalCount = compliance.requiredDocuments.length;
  const progress = Math.round((submittedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Upload Progress</span>
          <span>
            {submittedCount}/{totalCount} Documents
          </span>
        </div>
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {compliance.requiredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(doc.status)}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{doc.name}</span>
                  {getStatusBadge(doc.status)}
                </div>
                <p className="text-muted-foreground text-sm">
                  {doc.description}
                </p>
                {doc.submittedDate && (
                  <div className="text-muted-foreground flex gap-1 text-xs">
                    <span>
                      Submitted {format(new Date(doc.submittedDate), "MMM d")}
                    </span>
                    <span>•</span>
                    <span className="capitalize">By {doc.submittedBy}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 sm:self-center">
              {doc.status !== "pending" && (
                <Button variant="ghost" size="sm" className="h-8">
                  <Eye className="mr-2 h-3 w-3" />
                  View
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
