import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlertCircle, FileText, History, ShieldAlert } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface AdminSystemNotesCardProps {
  data: MerchantDetails["admin"];
}

export function AdminSystemNotesCard({ data }: AdminSystemNotesCardProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-600 dark:text-green-400";
    if (score < 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 70) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded border border-amber-200 bg-amber-50 p-2 text-sm font-medium text-amber-600 dark:border-amber-800/50 dark:bg-amber-900/10 dark:text-amber-400">
        <AlertCircle className="h-4 w-4" />
        INTERNAL ONLY — Not visible to merchant
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Score */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <ShieldAlert className="h-4 w-4" />
            Risk Assessment
          </h4>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${getRiskColor(data.riskScore)}`}
            >
              {data.riskScore}/100
            </span>
            <span className="text-muted-foreground text-sm">
              ({getRiskLabel(data.riskScore)})
            </span>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <History className="h-4 w-4" />
            Audit Trail
          </h4>
          <Button variant="outline" size="sm" className="w-full justify-start">
            View Full Audit Log
          </Button>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" />
          Internal Notes
        </h4>
        <div className="bg-muted/50 space-y-4 rounded-md border p-4">
          {data.notes.map((note) => (
            <div key={note.id} className="space-y-1">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-semibold">{note.author}</span>
                <span>{format(new Date(note.date), "MMM d, yyyy HH:mm")}</span>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
          {data.notes.length === 0 && (
            <p className="text-muted-foreground text-sm italic">
              No internal notes recorded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
