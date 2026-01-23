import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  CheckCircle2,
  CreditCard,
  History,
  Package,
  Settings,
  User,
} from "lucide-react";
import type { TimelineEvent } from "../lib/transaction-details-model";

interface TransactionTimelineCardProps {
  timeline: TimelineEvent[];
}

export function TransactionTimelineCard({
  timeline,
}: TransactionTimelineCardProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "financial":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case "logistic":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "admin":
        return <Settings className="h-4 w-4 text-amber-500" />;
      case "system":
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case "user":
        return <User className="text-muted-foreground h-4 w-4" />;
      default:
        return <History className="text-muted-foreground h-4 w-4" />;
    }
  };

  const getEventBg = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "financial":
        return "bg-emerald-100 dark:bg-emerald-900/20";
      case "logistic":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "admin":
        return "bg-amber-100 dark:bg-amber-900/20";
      case "system":
        return "bg-purple-100 dark:bg-purple-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-border absolute top-6 bottom-6 left-[27px] w-px md:left-[27px]" />

      <div className="relative space-y-6">
        {timeline.map((event) => (
          <div key={event.id} className="relative flex gap-4">
            {/* Icon Bubble */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getEventBg(
                event.type,
              )}`}
            >
              {getEventIcon(event.type)}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{event.title}</span>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(event.timestamp), "MMM d, HH:mm")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {event.description}
              </p>
              {event.actor && (
                <div className="flex items-center gap-1">
                  <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
                    {event.actor}
                  </span>
                  {event.type === "admin" && (
                    <Badge variant="outline" className="h-4 px-1 text-[10px]">
                      ADMIN
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button variant="outline" size="sm" className="w-full">
          View Full Audit Log
        </Button>
      </div>
    </div>
  );
}
