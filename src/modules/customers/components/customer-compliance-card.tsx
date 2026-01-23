import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Download, FileText } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerComplianceCardProps {
  data: CustomerDetails["compliance"];
}

export function CustomerComplianceCard({ data }: CustomerComplianceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900";
      case "submitted":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900";
      case "missing":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900";
      case "expired":
        return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "submitted":
        return <AlertCircle className="h-4 w-4" />; // Pending Review
      case "missing":
      case "expired":
        return <AlertCircle className="h-4 w-4" />; // Needs Action
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Overall Status:</span>
          <Badge
            variant="outline"
            className={`capitalize ${
              data.status === "compliant"
                ? "border-green-500 text-green-600"
                : data.status === "non_compliant"
                  ? "border-red-500 text-red-600"
                  : "border-amber-500 text-amber-600"
            }`}
          >
            {data.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {data.documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <div className="bg-muted text-muted-foreground rounded-md p-2">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="text-muted-foreground text-xs capitalize">
                  {doc.type.replace("_", " ")}
                </div>
                {doc.expiryDate && (
                  <div className="mt-1 text-xs text-amber-600">
                    Expires: {format(new Date(doc.expiryDate), "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`flex items-center gap-1.5 border capitalize ${getStatusColor(doc.status)}`}
              >
                {getStatusIcon(doc.status)}
                {doc.status}
              </Badge>

              {doc.status !== "missing" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
