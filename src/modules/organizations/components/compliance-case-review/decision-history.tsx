import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ComplianceCase } from "./placeholder-data";

interface DecisionHistoryProps {
  events: ComplianceCase["events"];
}

function formatEventType(eventType: string): string {
  const map: Record<string, string> = {
    "kyc.approved": "KYC — Approved",
    "kyc.action_required": "KYC — Action Required",
    "kyc.rejected": "KYC — Rejected",
    "kyb.approved": "KYB — Approved",
    "kyb.action_required": "KYB — Action Required",
    "kyb.rejected": "KYB — Rejected",
  };
  return map[eventType] ?? eventType;
}

function borderColor(eventType: string): string {
  if (eventType.includes("approved")) return "border-l-green-500";
  if (eventType.includes("action_required")) return "border-l-amber-500";
  if (eventType.includes("rejected")) return "border-l-red-500";
  return "border-l-border";
}

export function DecisionHistory({ events }: DecisionHistoryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Decision History</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No previous decisions.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "border-l-2 pl-4 py-2 space-y-1",
                  borderColor(event.eventType),
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {formatEventType(event.eventType)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(event.createdAt), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {event.actorType === "admin" && event.actorName
                    ? `By ${event.actorName}`
                    : event.actorType === "system"
                      ? "By System"
                      : "By User"}
                </p>
                {event.metadata?.reasons && event.metadata.reasons.length > 0 && (
                  <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5 text-xs">
                    {event.metadata.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
