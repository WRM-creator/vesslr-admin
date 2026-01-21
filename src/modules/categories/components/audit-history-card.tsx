import { format } from "date-fns";
import { History } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface AuditHistoryCardProps {
  data: Category["audit"];
}

export function AuditHistoryCard({ data }: AuditHistoryCardProps) {
  return (
    <div className="space-y-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2">
        <History className="h-4 w-4" />
        <span className="text-sm">Recent Changes</span>
      </div>

      <div className="space-y-4">
        {data.changes.map((change) => (
          <div
            key={change.id}
            className="bg-card flex gap-4 rounded-lg border p-4 shadow-sm"
          >
            <div className="flex min-w-[100px] flex-col items-center gap-1 border-r pr-4">
              <span className="text-muted-foreground text-xs font-semibold">
                {format(new Date(change.timestamp), "MMM d, yyyy")}
              </span>
              <span className="text-muted-foreground text-xs">
                {format(new Date(change.timestamp), "HH:mm")}
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{change.change}</p>
              <p className="text-muted-foreground text-xs">{change.reason}</p>
            </div>

            <div className="bg-secondary h-fit rounded-md px-2 py-1 text-xs font-medium">
              {change.actor}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
