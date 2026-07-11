import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { PersonScreeningDetailDto } from "@/lib/api/generated";
import { CALLOUT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, ExternalLinkIcon, ShieldAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ---------------------------------------------------------------------------
 * Raw provider payload shapes. Everything is optional and rendered
 * defensively: the sandbox and the documentation disagree on several fields
 * (adverse_media populated vs deprecated, enforcement_action vs
 * enforcement_actions, pep_level number vs string).
 * ------------------------------------------------------------------------- */

interface SourceDetails {
  listed_date?: string;
  source_link?: string[] | string;
  source_name?: string;
  source_type?: string;
}

interface ScreeningCandidate {
  ref?: string;
  name?: string;
  aliases?: string[];
  dates_of_birth?: string[];
  nationalities?: string[];
  addresses?: string[];
  sanctions?: Array<{
    date_of_birth?: string;
    nationality?: string;
    source_details?: SourceDetails;
  }>;
  enforcement_action?: Array<EnforcementAction>;
  enforcement_actions?: Array<EnforcementAction>;
  pep?: {
    pep_level?: number | string;
    political_positions?: Array<{
      country?: string;
      position?: string;
      from?: string;
      to?: string | null;
    }>;
    sources?: Array<{ source_link?: string[] | string; source_name?: string }>;
  };
  associations?: Array<{
    association_type?: string;
    name?: string;
    relationship?: string;
  }>;
  news_summary?: Array<{ newsCategory?: string; numberOfArticles?: number }>;
  adverse_media?: Array<{
    date_published?: string;
    publisher?: string;
    source_link?: string;
    title?: string;
  }>;
}

interface EnforcementAction {
  description?: string;
  date?: string;
  source_details?: SourceDetails;
}

interface ScreeningAdjudication {
  candidateRef: string;
  verdict: "false_positive" | "confirmed";
  note?: string;
  adminId?: string;
  at?: string;
}

interface ScreeningCheck {
  provider?: string;
  status?: string;
  referenceId?: string;
  checkedAt?: string;
  payload?: {
    people?: ScreeningCandidate[];
    Actions?: { Listed?: string };
  };
  adjudications?: ScreeningAdjudication[];
}

/** Same fallback the backend uses for candidates without a `ref`. */
const candidateRefOf = (candidate: ScreeningCandidate, index: number) =>
  candidate.ref ?? `idx-${index}`;

function pepLevelLabel(level: number | string | undefined): string {
  const map: Record<string, string> = {
    "1": "High exposure (level 1)",
    "2": "Medium exposure (level 2)",
    "3": "Low exposure (level 3)",
  };
  if (level === undefined) return "PEP";
  return map[String(level)] ?? String(level);
}

const firstLink = (link?: string[] | string) =>
  Array.isArray(link) ? link[0] : link;

function formatDate(iso?: string) {
  if (!iso) return undefined;
  try {
    return format(new Date(iso), "dd MMM yyyy");
  } catch {
    return iso;
  }
}

function SourceLink({ href, name }: { href?: string; name?: string }) {
  if (!href) return name ? <span>{name}</span> : null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-foreground inline-flex items-center gap-0.5 underline underline-offset-2"
    >
      {name ?? "source"}
      <ExternalLinkIcon className="size-3" />
    </a>
  );
}

function EvidenceGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground pb-1 text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </p>
      <div className="space-y-1 text-xs">{children}</div>
    </div>
  );
}

/** The comparison annotation: candidate value, with our subject's value beside
 * it in text whenever they disagree. Text, not color, on purpose. */
function compared(value: string, subjectValue?: string): string {
  if (!subjectValue) return value;
  return value.startsWith(subjectValue)
    ? value
    : `${value} (subject: ${subjectValue})`;
}

function CandidateCard({
  candidate,
  index,
  total,
  adjudication,
  subjectBirthYear,
  isSaving,
  onAdjudicate,
}: {
  candidate: ScreeningCandidate;
  index: number;
  total: number;
  adjudication?: ScreeningAdjudication;
  subjectBirthYear?: string;
  isSaving: boolean;
  onAdjudicate: (verdict: "false_positive" | "confirmed", note: string) => void;
}) {
  const [verdict, setVerdict] = useState<"false_positive" | "confirmed" | null>(
    null,
  );
  const [note, setNote] = useState("");

  const enforcement = [
    ...(candidate.enforcement_action ?? []),
    ...(candidate.enforcement_actions ?? []),
  ];
  const media = candidate.adverse_media ?? [];
  const newsSummary = candidate.news_summary ?? [];

  const identityBits = [
    ...(candidate.dates_of_birth ?? []).map((dob) =>
      compared(`Born ${dob.slice(0, 4)}`, subjectBirthYear && `Born ${subjectBirthYear}`),
    ),
    ...(candidate.nationalities ?? []),
    ...(candidate.addresses ?? []),
  ];

  const ruling = adjudication && verdict === null;

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-medium">{candidate.name ?? "Unnamed candidate"}</p>
        <span className="text-muted-foreground text-xs">
          Candidate {index + 1} of {total}
        </span>
      </div>

      {identityBits.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {identityBits.join(" · ")}
        </p>
      )}
      {candidate.aliases && candidate.aliases.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Also known as {candidate.aliases.join(", ")}
        </p>
      )}

      {(candidate.sanctions?.length ?? 0) > 0 && (
        <EvidenceGroup label="Sanctions">
          {candidate.sanctions?.map((s, i) => (
            <p key={i} className="text-muted-foreground">
              {s.source_details?.source_name ?? "Sanctions listing"}
              {s.source_details?.listed_date &&
                ` · listed ${formatDate(s.source_details.listed_date)}`}
              {firstLink(s.source_details?.source_link) && (
                <>
                  {" · "}
                  <SourceLink
                    href={firstLink(s.source_details?.source_link)}
                    name="source"
                  />
                </>
              )}
            </p>
          ))}
        </EvidenceGroup>
      )}

      {candidate.pep && (
        <EvidenceGroup label="PEP">
          <p className="text-muted-foreground">
            {pepLevelLabel(candidate.pep.pep_level)}
            {(candidate.pep.political_positions ?? [])
              .map(
                (p) =>
                  ` · ${[p.position, p.country].filter(Boolean).join(", ")}${p.to === null ? " (current)" : ""}`,
              )
              .join("")}
          </p>
          {(candidate.pep.sources ?? []).length > 0 && (
            <p className="text-muted-foreground">
              {candidate.pep.sources?.map((s, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  <SourceLink
                    href={firstLink(s.source_link)}
                    name={s.source_name}
                  />
                </span>
              ))}
            </p>
          )}
        </EvidenceGroup>
      )}

      {enforcement.length > 0 && (
        <EvidenceGroup label="Enforcement actions">
          {enforcement.map((e, i) => (
            <p key={i} className="text-muted-foreground">
              {e.description ?? "Enforcement action"}
              {e.date && ` · ${formatDate(e.date)}`}
              {firstLink(e.source_details?.source_link) && (
                <>
                  {" · "}
                  <SourceLink
                    href={firstLink(e.source_details?.source_link)}
                    name={e.source_details?.source_name ?? "source"}
                  />
                </>
              )}
            </p>
          ))}
        </EvidenceGroup>
      )}

      {(media.length > 0 || newsSummary.length > 0) && (
        <EvidenceGroup label="Adverse media">
          {media.map((m, i) => (
            <p key={i} className="text-muted-foreground">
              {m.source_link ? (
                <SourceLink href={m.source_link} name={m.title ?? "article"} />
              ) : (
                (m.title ?? "Article")
              )}
              {m.publisher && ` · ${m.publisher}`}
              {m.date_published && ` · ${formatDate(m.date_published)}`}
            </p>
          ))}
          {newsSummary.map((n, i) => (
            <p key={i} className="text-muted-foreground">
              {n.newsCategory ?? "News"}
              {typeof n.numberOfArticles === "number" &&
                ` · ${n.numberOfArticles} article${n.numberOfArticles === 1 ? "" : "s"}`}
            </p>
          ))}
        </EvidenceGroup>
      )}

      {(candidate.associations?.length ?? 0) > 0 && (
        <EvidenceGroup label="Associations">
          {candidate.associations?.map((a, i) => (
            <p key={i} className="text-muted-foreground">
              {a.name ?? "Associate"}
              {a.relationship && ` · ${a.relationship}`}
              {a.association_type && ` · ${a.association_type}`}
            </p>
          ))}
        </EvidenceGroup>
      )}

      <div className="border-border/70 border-t pt-3">
        {ruling ? (
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              {adjudication.verdict === "false_positive" ? (
                <>
                  <CheckIcon className="size-3.5 text-green-600" />
                  Dismissed as false positive
                </>
              ) : (
                <>
                  <ShieldAlertIcon className="size-3.5 text-red-600" />
                  Match confirmed
                </>
              )}
              {adjudication.at && (
                <span className="text-muted-foreground font-normal">
                  · {formatDate(adjudication.at)}
                </span>
              )}
            </p>
            {adjudication.note && (
              <p className="text-muted-foreground text-xs">
                “{adjudication.note}”
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-6 px-1.5 text-xs"
              onClick={() => setVerdict(adjudication.verdict)}
            >
              Change ruling
            </Button>
          </div>
        ) : verdict === null ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setVerdict("false_positive")}
            >
              Dismiss as false positive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground h-7 px-2.5 text-xs"
              onClick={() => setVerdict("confirmed")}
            >
              Confirm match
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">
              {verdict === "false_positive"
                ? "Why this is not the screened person"
                : "Why this is the screened person"}
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 2000))}
              rows={3}
              autoFocus
              placeholder="A note is required for the audit trail"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={verdict === "confirmed" ? "destructive" : "default"}
                className="h-7 px-2.5 text-xs"
                disabled={note.trim().length === 0 || isSaving}
                onClick={() => onAdjudicate(verdict, note.trim())}
              >
                {isSaving && <Spinner className="mr-1 size-3" />}
                Save ruling
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => {
                  setVerdict(null);
                  setNote("");
                }}
              >
                Cancel
              </Button>
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                {note.length}/2000
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Match review: the raw provider candidates for one screened person, with
 * per-candidate rulings recorded inline. Resolution state (all dismissed →
 * passed; a confirm keeps manual_review) is always read from the server
 * response, never computed here.
 */
export function ScreeningReviewSheet({
  open,
  onOpenChange,
  organizationId,
  personId,
  subjectContext,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  personId: string | null;
  /** Our subject's known facts, for side-by-side comparison with candidates. */
  subjectContext?: { birthYear?: string; nationality?: string };
}) {
  const { data: rawData, isLoading } =
    api.admin.compliance.screeningDetail.useQuery(
      { path: { organizationId, personId: personId ?? "" } },
      { enabled: open && personId !== null },
    );
  const raw = rawData as unknown;
  const detail = ((raw as { data?: PersonScreeningDetailDto })?.data ?? raw) as
    | PersonScreeningDetailDto
    | undefined;

  const { mutate: adjudicate, isPending: isSaving } =
    api.admin.compliance.adjudicateScreening.useMutation();

  const check = detail?.check as ScreeningCheck | null | undefined;
  const candidates = check?.payload?.people ?? [];
  const adjudications = check?.adjudications ?? [];
  const hasConfirmed = adjudications.some((a) => a.verdict === "confirmed");
  const resolvedPassed =
    detail?.amlCheck?.status === "passed" && adjudications.length > 0;

  const handleAdjudicate = (
    candidateRef: string,
    verdict: "false_positive" | "confirmed",
    note: string,
  ) => {
    if (!personId) return;
    adjudicate(
      {
        path: { organizationId, personId },
        body: { candidateRef, verdict, note },
      },
      {
        onSuccess: () => toast.success("Ruling saved"),
        onError: () => {
          toast.error("Could not save the ruling", {
            description: "Check the candidate still exists and try again.",
          });
        },
      },
    );
  };

  const subjectBits = [
    detail?.name,
    subjectContext?.birthYear && `b. ${subjectContext.birthYear}`,
    subjectContext?.nationality,
  ].filter(Boolean);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <div className="bg-background sticky top-0 z-10 border-b px-6 pt-6 pb-4">
          <SheetHeader className="space-y-1 p-0 text-left">
            <SheetTitle>
              Screening review{detail?.name ? `: ${detail.name}` : ""}
            </SheetTitle>
            <SheetDescription asChild>
              <div>
                <p className="text-sm">{subjectBits.join(" · ")}</p>
                <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                  {detail?.roles
                    .map((r) => r.replace(/_/g, " "))
                    .join(", ")}
                  {detail?.amlCheck?.listed &&
                    ` · ${detail.amlCheck.listed}`}
                  {detail?.amlCheck?.referenceId &&
                    ` · ref ${detail.amlCheck.referenceId}`}
                  {check?.provider === "smile_id" && " · Smile ID"}
                </p>
              </div>
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-3 px-6 py-4">
          {resolvedPassed && (
            <div className={cn("rounded-md border p-3 text-sm", CALLOUT.green)}>
              All candidates dismissed. This screening now reads Passed.
            </div>
          )}
          {hasConfirmed && (
            <div className={cn("rounded-md border p-3 text-sm", CALLOUT.red)}>
              Confirmed match on record. This screening stays in review; factor
              it into the case decision.
            </div>
          )}

          {isLoading ? (
            <>
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-40 w-full rounded-md" />
            </>
          ) : candidates.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No match candidates on this screening.
            </p>
          ) : (
            candidates.map((candidate, i) => {
              const ref = candidateRefOf(candidate, i);
              const adjudication = adjudications.find(
                (a) => a.candidateRef === ref,
              );
              return (
                <CandidateCard
                  // Ruling in the key: a saved/replaced adjudication remounts
                  // the card, closing the inline editor onto the fresh ruling.
                  key={`${ref}:${adjudication?.verdict ?? ""}:${adjudication?.at ?? ""}`}
                  candidate={candidate}
                  index={i}
                  total={candidates.length}
                  adjudication={adjudication}
                  subjectBirthYear={subjectContext?.birthYear}
                  isSaving={isSaving}
                  onAdjudicate={(verdict, note) =>
                    handleAdjudicate(ref, verdict, note)
                  }
                />
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
