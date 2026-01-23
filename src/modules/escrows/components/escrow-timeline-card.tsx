import { formatDistanceToNow } from "date-fns";
import {
  Banknote,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  User,
} from "lucide-react";
import type { TimelineEvent } from "../lib/escrow-details-model";

interface EscrowTimelineCardProps {
  timeline: TimelineEvent[];
}

export function EscrowTimelineCard({ timeline }: EscrowTimelineCardProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "financial":
        return <Banknote className="h-4 w-4" />;
      case "system":
        return <LayoutDashboard className="h-4 w-4" />;
      case "admin":
        return <ShieldAlert className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "financial":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "system":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "admin":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "user":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="relative space-y-0">
      {/* Vertical Line */}
      <div className="bg-border absolute top-2 bottom-2 left-4 w-px" />

      {timeline.map((event) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          <div
            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm dark:bg-black ${getEventColor(
              event.type,
            )}`}
          >
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1 space-y-1 pt-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-foreground text-sm font-semibold">
                {event.title}
              </h4>
              <time className="text-muted-foreground text-xs whitespace-nowrap">
                {formatDistanceToNow(new Date(event.timestamp), {
                  addSuffix: true,
                })}
              </time>
            </div>
            {event.description && (
              <p className="text-muted-foreground text-sm">
                {event.description}
              </p>
            )}
            {event.actor && (
              <p className="text-muted-foreground mt-1 text-xs">
                Actor: <span className="font-medium">{event.actor}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
