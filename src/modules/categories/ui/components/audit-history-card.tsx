import { format } from "date-fns";
import { History } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface AuditHistoryCardProps {
  data: Category["audit"];
}

export function AuditHistoryCard({ data }: AuditHistoryCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <History className="h-4 w-4" />
        <span className="text-sm">Recent Changes</span>
      </div>
      
      <div className="space-y-4">
        {data.changes.map((change) => (
            <div key={change.id} className="flex gap-4 p-4 rounded-lg bg-card border shadow-sm">
                <div className="flex flex-col items-center gap-1 min-w-[100px] border-r pr-4">
                    <span className="text-xs font-semibold text-muted-foreground">
                        {format(new Date(change.timestamp), "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(change.timestamp), "HH:mm")}
                    </span>
                </div>
                
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{change.change}</p>
                    <p className="text-xs text-muted-foreground">{change.reason}</p>
                </div>

                <div className="text-xs font-medium bg-secondary px-2 py-1 rounded-md h-fit">
                    {change.actor}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
