import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, Clock, Zap } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface ActivitySignalsCardProps {
  data: MerchantDetails["activity"];
}

export function ActivitySignalsCard({ data }: ActivitySignalsCardProps) {
  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Last Active */}
      <div className="bg-card flex flex-col gap-2 rounded-lg border p-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Last Active
        </div>
        <span className="text-lg font-medium">
          {formatDistanceToNow(new Date(data.lastActive))} ago
        </span>
      </div>

      {/* Response Time */}
      <div className="bg-card flex flex-col gap-2 rounded-lg border p-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4" />
          Avg Response Time
        </div>
        <span className="text-lg font-medium">{data.avgResponseTime}</span>
      </div>

      {/* Activity Level */}
      <div className="bg-card flex flex-col gap-2 rounded-lg border p-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Activity Level
        </div>
        <div>
          <Badge
            variant="outline"
            className={`border-0 ${getActivityColor(data.activityLevel)}`}
          >
            {data.activityLevel.toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
}
