import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { reasonIssueLabel, reasonTargetLabel } from "./reason-options";
import type { ComplianceCase } from "./types";

interface DecisionHistoryProps {
  events: ComplianceCase["events"];
}

function formatEventType(eventType: string): string {
  const map: Record<string, string> = {
    "kyc.approved": "Identity approved",
    "kyc.action_required": "Identity changes requested",
    "kyc.rejected": "Identity rejected",
    "kyb.approved": "Business approved",
    "kyb.action_required": "Business changes requested",
    "kyb.rejected": "Business rejected",
    "kyb.changes_requested": "Changes requested",
    "kyb.documents_requested": "Documents requested",
    "kyb.document_provided": "Document provided",
    "kyb.provider_verification_declined": "Provider declined",
  };
  return map[eventType] ?? eventType.replace(/^(kyb|kyc)\./, "").replace(/_/g, " ");
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
          <p className="text-muted-foreground text-sm">
            No previous decisions.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "space-y-1 border-l-2 py-2 pl-4",
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
                {event.metadata?.label && (
                  <p className="text-muted-foreground text-xs">
                    {event.metadata.file?.url ? (
                      <a
                        href={event.metadata.file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground underline underline-offset-2"
                      >
                        {event.metadata.label}
                      </a>
                    ) : (
                      event.metadata.label
                    )}
                  </p>
                )}
                {event.metadata?.reasons &&
                  event.metadata.reasons.length > 0 && (
                    <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5 text-xs">
                      {event.metadata.reasons.map((r, i) => (
                        <li key={i}>
                          {reasonTargetLabel(r.target)} ·{" "}
                          {reasonIssueLabel(r.target, r.issue)}
                          {r.note ? `: ${r.note}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                {event.metadata?.checklist &&
                  event.metadata.checklist.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs">
                      {event.metadata.checklist.map((c, i) => (
                        <li
                          key={i}
                          className="text-muted-foreground flex items-center gap-1.5"
                        >
                          {c.passed ? (
                            <CheckIcon className="size-3 text-green-600" />
                          ) : (
                            <XIcon className="size-3 text-red-500" />
                          )}
                          {c.label}
                        </li>
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
