import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AlertCircle, FileText, Send, ShieldAlert } from "lucide-react";
import type { TransactionDetails } from "../lib/transaction-details-model";

interface TransactionAdminNotesCardProps {
  data: TransactionDetails["admin"];
}

export function TransactionAdminNotesCard({
  data,
}: TransactionAdminNotesCardProps) {
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
        INTERNAL ONLY — Not visible to users
      </div>

      <div className="grid gap-6">
        {/* Risk Score */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-muted-foreground h-5 w-5" />
            <span className="font-medium">Risk Assessment</span>
          </div>
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

        {/* Existing Notes */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Internal Notes
          </h4>
          <div className="bg-muted/50 max-h-[300px] overflow-y-auto rounded-md border p-4">
            <div className="space-y-4">
              {data.notes.map((note) => (
                <div key={note.id} className="space-y-1">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="font-semibold">{note.author}</span>
                    <span>
                      {format(new Date(note.date), "MMM d, yyyy HH:mm")}
                    </span>
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

        {/* Add Note Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add an internal note..."
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button size="sm">
              <Send className="mr-2 h-3 w-3" />
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
