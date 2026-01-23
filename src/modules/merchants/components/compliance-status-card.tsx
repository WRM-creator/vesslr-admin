import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface ComplianceStatusCardProps {
  data: MerchantDetails["compliance"];
}

export function ComplianceStatusCard({ data }: ComplianceStatusCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "missing":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "submitted":
        return "Pending Review";
      case "missing":
        return "Missing";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Documents Table */}
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium">Document Name</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.documents.map((doc, idx) => (
              <tr key={idx} className="bg-card">
                <td className="px-4 py-3 font-medium">{doc.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span className="text-muted-foreground capitalize">
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                </td>
                <td className="text-muted-foreground px-4 py-3 text-right">
                  {doc.expiryDate
                    ? format(new Date(doc.expiryDate), "MMM d, yyyy")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Approved Categories */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-sm font-medium">
            Approved Trade Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.approvedCategories.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Review */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-sm font-medium">
            Last Compliance Review
          </h4>
          <p className="text-base">
            {format(new Date(data.lastReviewDate), "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
