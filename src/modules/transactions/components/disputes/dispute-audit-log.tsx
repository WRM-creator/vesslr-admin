import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminDisputeAuditEventDto,
  AdminDisputeResponseDto,
} from "@/lib/api/generated/types.gen";
import { Download } from "lucide-react";
import { useState } from "react";

interface DisputeAuditLogProps {
  dispute: AdminDisputeResponseDto;
}

const COLLAPSED_COUNT = 6;

const formatOutcome = (outcome?: string): string => {
  const map: Record<string, string> = {
    PROCEED: "Release to Seller",
    CANCELLED: "Refund to Buyer",
    PARTIAL_REFUND: "Cancel & Split Settlement",
    RE_INSPECT: "Re-inspect",
    MUTUAL_SETTLEMENT: "Mutual Settlement",
    ESCALATED: "Escalated",
  };
  return outcome ? (map[outcome] ?? outcome) : "Unknown";
};

const getAuditLabel = (event: AdminDisputeAuditEventDto): string => {
  const actor = event.actor
    ? `${event.actor.firstName} ${event.actor.lastName}`
    : "System";

  switch (event.action) {
    case "RAISED":
      return `Dispute raised by ${actor}`;
    case "STATUS_CHANGED":
      return `Status changed to ${(event.metadata?.newStatus as string)?.replace(/_/g, " ") ?? "unknown"}`;
    case "RESOLVED":
      return `Resolved: ${formatOutcome(event.metadata?.outcome as string)} by ${actor}`;
    case "ESCALATED":
      return `Escalated by ${actor}`;
    case "WITHDRAWN":
      return `Dispute withdrawn by ${actor}`;
    default:
      return event.action.replace(/_/g, " ");
  }
};

export function DisputeAuditLog({ dispute }: DisputeAuditLogProps) {
  const [expanded, setExpanded] = useState(false);

  const logs = dispute.auditLog ?? [];
  const hasMore = logs.length > COLLAPSED_COUNT;
  const visibleLogs = expanded ? logs : logs.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Audit Log</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          <Download className="size-3.5" />
          Download
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center text-xs">
              No logs found.
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="space-y-4">
                  {visibleLogs.map((log, index) => (
                    <div key={index} className="flex gap-4 text-sm">
                      <span className="text-muted-foreground min-w-[80px] text-xs">
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                      <span className="text-foreground/80 text-xs font-medium">
                        {getAuditLabel(log)}
                      </span>
                    </div>
                  ))}
                </div>
                {hasMore && !expanded && (
                  <div className="from-card pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t to-transparent" />
                )}
              </div>
              {hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full text-xs"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded
                    ? "Show less"
                    : `Show ${logs.length - COLLAPSED_COUNT} more`}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
