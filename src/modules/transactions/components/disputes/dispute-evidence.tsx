import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { FileText, MessageSquare } from "lucide-react";
import type { Dispute, DisputeEvent } from "./dispute-types";

interface DisputeEvidenceProps {
  dispute: Dispute;
}

export function DisputeEvidence({ dispute }: DisputeEvidenceProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="mb-2 max-h-5">
        <CardTitle className="text-base font-medium">
          Evidence Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {dispute.timeline.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === dispute.timeline.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function TimelineItem({
  event,
  isLast,
}: {
  event: DisputeEvent;
  isLast: boolean;
}) {
  const Icon = getEventIcon(event.type);

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className="bg-border absolute top-8 bottom-[-24px] left-4 w-px md:left-5" />
      )}
      <div className="bg-background relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border md:h-10 md:w-10">
        <Icon className="text-muted-foreground h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1 pt-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">{event.actor}</div>
          <div className="text-muted-foreground text-xs">
            {formatDateTime(event.timestamp)}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md border p-3 text-sm">
          <p className="text-muted-foreground whitespace-pre-wrap">
            {event.content}
          </p>
          {event.attachments && event.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              {event.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-background flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs"
                >
                  <FileText className="text-muted-foreground h-3.5 w-3.5" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getEventIcon(type: DisputeEvent["type"]) {
  switch (type) {
    case "evidence":
      return FileText;
    case "comment":
      return MessageSquare;
    case "system":
    default:
      return FileText;
  }
}
