import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  FileText,
  Gavel,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

// Simplified timeline concept until API supports it fully
export interface TimelineEvent {
  id: string;
  type: "message" | "system" | "admin" | "evidence";
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  actorRole?: "initiator" | "respondent" | "admin" | "system";
}

interface DisputeTimelineCardProps {
  timeline: TimelineEvent[];
}

export function DisputeTimelineCard({ timeline }: DisputeTimelineCardProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "system":
        return <LayoutDashboard className="h-4 w-4" />;
      case "admin":
        return <Gavel className="h-4 w-4" />;
      case "evidence":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventColor = (
    type: TimelineEvent["type"],
    role?: TimelineEvent["actorRole"],
  ) => {
    if (type === "admin")
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";

    if (role === "initiator")
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";

    if (role === "respondent")
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";

    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <div className="relative space-y-0">
      {/* Vertical Line */}
      <div className="bg-border absolute top-2 bottom-2 left-4 w-px" />

      {timeline.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">
          No timeline events yet.
        </div>
      )}

      {timeline.map((event) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          <div
            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm dark:bg-black ${getEventColor(
              event.type,
              event.actorRole,
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
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <span className="font-medium">{event.actor}</span>
                {event.actorRole && (
                  <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                    {event.actorRole}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
