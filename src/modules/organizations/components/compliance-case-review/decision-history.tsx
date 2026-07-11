import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { reasonIssueLabel, reasonTargetLabel } from "./reason-options";
import type { ComplianceCase } from "./types";

interface DecisionHistoryProps {
  events: ComplianceCase["events"];
  /** Total events on the case; larger than events.length means truncation. */
  totalEvents?: number;
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
    "kyb.registry_people_adopted": "Registry people adopted",
    "kyb.provider_verification_declined": "Provider declined",
    "kyb.people_screening_completed": "People screened (submission)",
    "kyb.person_screening_requested": "Screening requested",
    "kyb.person_screening_completed": "Screening completed",
    "kyb.person_screening_failed": "Screening failed",
    "kyb.person_screening_adjudicated": "Screening match adjudicated",
    "payments.provisioning_triggered": "Payments provisioning triggered",
    "payments.onboarding_status_changed": "Payments provider status changed",
  };
  const label =
    map[eventType] ??
    eventType.replace(/^(kyb|kyc|payments)\./, "").replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dotColor(eventType: string, metadata?: ScreeningEventMetadata): string {
  if (eventType.includes("screening_failed")) return "bg-red-500";
  if (eventType.includes("screening_completed")) {
    // A completed screen that found a match is not a green moment.
    return metadata?.outcome === "passed"
      ? "bg-green-500"
      : "bg-muted-foreground/40";
  }
  if (eventType.includes("approved")) return "bg-green-500";
  if (eventType.includes("action_required")) return "bg-amber-500";
  if (eventType.includes("rejected") || eventType.includes("declined"))
    return "bg-red-500";
  return "bg-muted-foreground/40";
}

/** Screening event metadata written by PersonScreeningService. */
interface ScreeningEventMetadata {
  name?: string;
  outcome?: string;
  listed?: string;
  referenceId?: string;
  verdict?: "false_positive" | "confirmed";
  note?: string;
  subjects?: Array<{ name?: string; outcome?: string }>;
  failures?: number;
}

const OUTCOME_LABEL: Record<string, string> = {
  passed: "Passed",
  manual_review: "Needs review",
  failed: "Failed",
};

/** One-line summary for a screening event, from its metadata. */
function screeningLine(
  eventType: string,
  metadata?: ScreeningEventMetadata,
): string | undefined {
  if (!eventType.includes("screening")) return undefined;
  if (!metadata) return undefined;
  if (eventType.endsWith("adjudicated")) {
    const verdict =
      metadata.verdict === "false_positive"
        ? "Dismissed as false positive"
        : "Match confirmed";
    return [
      metadata.name,
      metadata.note ? `${verdict}: “${metadata.note}”` : verdict,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (metadata.subjects && metadata.subjects.length > 0) {
    const failures = metadata.failures ?? 0;
    return (
      `${metadata.subjects.length} ${metadata.subjects.length === 1 ? "person" : "people"} screened` +
      (failures > 0 ? `, ${failures} failed` : "") +
      `: ${metadata.subjects.map((s) => s.name).filter(Boolean).join(", ")}`
    );
  }
  return (
    [
      metadata.name,
      metadata.outcome && (OUTCOME_LABEL[metadata.outcome] ?? metadata.outcome),
      metadata.listed && `(${metadata.listed})`,
      metadata.referenceId && `ref ${metadata.referenceId}`,
    ]
      .filter(Boolean)
      .join(" · ") || undefined
  );
}

export function DecisionHistory({ events, totalEvents }: DecisionHistoryProps) {
  const truncated =
    typeof totalEvents === "number" && totalEvents > events.length;
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Decision History</CardTitle>
          {truncated && (
            <span className="text-muted-foreground text-xs">
              Showing the latest {events.length} of {totalEvents} events
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No previous decisions.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const screeningMeta = event.metadata as
                | ScreeningEventMetadata
                | undefined;
              const screeningSummary = screeningLine(
                event.eventType,
                screeningMeta,
              );
              return (
              <div key={event.id} className="space-y-1 py-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        dotColor(event.eventType, screeningMeta),
                      )}
                    />
                    {formatEventType(event.eventType)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(event.createdAt), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                <p className="text-muted-foreground pl-3.5 text-xs">
                  {event.actorType === "admin"
                    ? `By ${event.actorName ?? "an admin"}`
                    : event.actorType === "system"
                      ? "By System"
                      : "By Applicant"}
                </p>
                {screeningSummary && (
                  <p className="text-muted-foreground pl-3.5 text-xs tabular-nums">
                    {screeningSummary}
                  </p>
                )}
                {event.metadata?.label && (
                  <p className="text-muted-foreground pl-3.5 text-xs">
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
                    <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5 pl-3.5 text-xs">
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
                    <ul className="mt-1 space-y-0.5 pl-3.5 text-xs">
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
