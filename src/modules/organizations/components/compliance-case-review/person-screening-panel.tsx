import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type {
  BusinessPersonDto,
  PersonAmlCheckSummaryDto,
  PersonScreeningSubjectDto,
  ScreenAllResponseDto,
} from "@/lib/api/generated";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RotateCwIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScreeningReviewSheet } from "./screening-review-sheet";

const ROLE_LABEL: Record<string, string> = {
  representative: "Representative",
  director: "Director",
  beneficial_owner: "Beneficial owner",
};

/**
 * The panel's five row states. `needs_screening` is a manual_review check that
 * did not come from the real provider (kill switch or legacy stub row): it
 * must read as unscreened work, never as a screened result.
 */
type RowState =
  | "not_screened"
  | "passed"
  | "needs_review"
  | "needs_screening"
  | "failed";

function rowState(check?: PersonAmlCheckSummaryDto | null): RowState {
  if (!check) return "not_screened";
  if (check.status === "failed") return "failed";
  if (check.status === "passed") return "passed";
  return check.provider === "smile_id" ? "needs_review" : "needs_screening";
}

/** Same labels and tints as the VerificationBand's ScreeningValue — one status
 * vocabulary on the screen, not two. */
const STATE_BADGE: Record<RowState, { tint: string; label: string }> = {
  not_screened: { tint: TINT.gray, label: "Not screened" },
  passed: { tint: TINT.green, label: "Passed" },
  needs_review: { tint: TINT.amber, label: "Needs review" },
  needs_screening: { tint: TINT.gray, label: "Needs screening" },
  failed: { tint: TINT.red, label: "Failed" },
};

/** Backend screen-all only covers these; stub/disabled rows re-run per-row. */
const isPendingForScreenAll = (s: PersonScreeningSubjectDto) =>
  rowState(s.amlCheck) === "not_screened" || rowState(s.amlCheck) === "failed";

function roleLine(roles: string[]): string {
  return roles.map((r) => ROLE_LABEL[r] ?? r.replace(/_/g, " ")).join(" · ");
}

/** Outcome toast mirroring the returned check; the row is the durable record. */
function outcomeToast(subject: PersonScreeningSubjectDto) {
  const state = rowState(subject.amlCheck);
  if (state === "failed") {
    toast.error("Screening failed", {
      description: subject.amlCheck?.errorMessage,
    });
  } else if (state === "needs_review") {
    toast.warning(`Match found for ${subject.name}, review needed`);
  } else if (state === "passed") {
    toast.success(`${subject.name} screened, no matches`);
  }
}

function SubjectRow({
  subject,
  isScreening,
  onRun,
  onReview,
}: {
  subject: PersonScreeningSubjectDto;
  isScreening: boolean;
  onRun: () => void;
  onReview: () => void;
}) {
  const check = subject.amlCheck;
  const state = rowState(check);
  const badge = STATE_BADGE[state];
  const resolved = check ? check.matchCount - check.unresolvedMatches : 0;

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm">
          <span className="font-medium">{subject.name}</span>
          <span className="text-muted-foreground ml-2 text-xs">
            {roleLine(subject.roles)}
          </span>
        </p>
        {state === "failed" && check?.errorMessage ? (
          <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
            {check.errorMessage}
          </p>
        ) : state === "needs_review" && check ? (
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            {check.matchCount} possible{" "}
            {check.matchCount === 1 ? "match" : "matches"}
            {resolved > 0 && `, ${resolved} resolved`}
            {check.checkedAt &&
              ` · screened ${format(new Date(check.checkedAt), "dd MMM yyyy")}`}
          </p>
        ) : (state === "passed" || state === "needs_screening") &&
          check?.checkedAt ? (
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            Screened {format(new Date(check.checkedAt), "dd MMM yyyy")}
            {check.referenceId && ` · ref ${check.referenceId}`}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isScreening ? (
          <Badge variant="outline" className={cn("font-medium", TINT.gray)}>
            <Spinner className="mr-1 size-3" />
            Screening…
          </Badge>
        ) : (
          <Badge variant="outline" className={cn("font-medium", badge.tint)}>
            {badge.label}
          </Badge>
        )}
        {isScreening ? null : state === "needs_review" ? (
          <Button size="sm" className="h-7 px-2.5 text-xs" onClick={onReview}>
            Review match
          </Button>
        ) : state === "passed" ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-7"
            title="Re-run screening"
            onClick={onRun}
          >
            <RotateCwIcon className="size-3.5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={onRun}
          >
            {state === "failed" ? "Re-run" : "Run check"}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * AML screening state for every natural person on the case (representative,
 * directors, beneficial owners), one row per merged human. Renders STORED
 * people (the screening subjects) — distinct from RegistryPeople, which
 * renders registry-sourced records. Matches open in the review sheet; rulings
 * happen there. Status only ever reflects what the server returned.
 */
export function PersonScreeningPanel({
  organizationId,
  people,
}: {
  organizationId: string;
  /** Stored case people; used only to enrich the review sheet's subject strip. */
  people?: BusinessPersonDto[];
}) {
  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
  } = api.admin.compliance.screenings.useQuery({
    path: { organizationId },
  });
  // The endpoint wraps its payload in `{ message, data }` (same as getCase).
  const raw = rawData as unknown;
  const subjects = ((raw as { data?: PersonScreeningSubjectDto[] })?.data ??
    raw) as PersonScreeningSubjectDto[] | undefined;

  const { mutate: screenPerson } =
    api.admin.compliance.screenPerson.useMutation();
  const { mutate: screenAll, isPending: isScreeningAll } =
    api.admin.compliance.screenAll.useMutation();

  // Rows currently mid-screen. Local state rather than mutation.isPending so
  // several rows can run (and render) independently.
  const [screeningIds, setScreeningIds] = useState<Set<string>>(new Set());
  const [reviewPersonId, setReviewPersonId] = useState<string | null>(null);

  const markScreening = (ids: string[], on: boolean) =>
    setScreeningIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });

  const runScreen = (subject: PersonScreeningSubjectDto) => {
    markScreening([subject.personId], true);
    screenPerson(
      { path: { organizationId, personId: subject.personId } },
      {
        onSuccess: (res) => {
          const updated = ((res as { data?: PersonScreeningSubjectDto })
            ?.data ?? res) as PersonScreeningSubjectDto;
          outcomeToast(updated);
        },
        onError: () => {
          toast.error("Screening request failed", {
            description: "The screen did not run. Try again.",
          });
        },
        onSettled: () => markScreening([subject.personId], false),
      },
    );
  };

  const runScreenAll = () => {
    const ids = (subjects ?? [])
      .filter(isPendingForScreenAll)
      .map((s) => s.personId);
    markScreening(ids, true);
    screenAll(
      { path: { organizationId } },
      {
        onSuccess: (res) => {
          const outcome = ((res as { data?: ScreenAllResponseDto })?.data ??
            res) as ScreenAllResponseDto;
          const failed = outcome.screened.filter(
            (s) => rowState(s.amlCheck) === "failed",
          ).length;
          const parts = [`${outcome.screened.length} screened`];
          if (outcome.skipped > 0) parts.push(`${outcome.skipped} skipped`);
          if (failed > 0) parts.push(`${failed} failed`);
          (failed > 0 ? toast.warning : toast.success)(parts.join(", "));
        },
        onError: () => {
          toast.error("Screening request failed", {
            description: "Nothing was screened. Try again.",
          });
        },
        onSettled: () => markScreening(ids, false),
      },
    );
  };

  const needReview = (subjects ?? []).filter(
    (s) => rowState(s.amlCheck) === "needs_review",
  ).length;
  const unscreened = (subjects ?? []).filter((s) => {
    const state = rowState(s.amlCheck);
    return state === "not_screened" || state === "needs_screening";
  }).length;
  const pendingCount = (subjects ?? []).filter(isPendingForScreenAll).length;

  const reviewSubject = (subjects ?? []).find(
    (s) => s.personId === reviewPersonId,
  );
  // Birth year / nationality for the sheet's comparison strip come from the
  // stored person records backing this subject (the list rows carry neither).
  const backingPerson = people?.find((p) =>
    reviewSubject?.personIds.includes(p._id),
  );

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">AML screening</h3>
          {needReview > 0 ? (
            <Badge variant="outline" className={cn("font-medium", TINT.amber)}>
              {needReview} need{needReview === 1 ? "s" : ""} review
            </Badge>
          ) : subjects && subjects.length > 0 ? (
            <span className="text-muted-foreground text-xs">
              {unscreened > 0
                ? `${unscreened} not screened`
                : "All people screened"}
            </span>
          ) : null}
        </div>
        {pendingCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={runScreenAll}
            disabled={isScreeningAll}
          >
            {isScreeningAll ? (
              <Spinner className="size-3.5" />
            ) : (
              <ShieldCheckIcon className="size-3.5" />
            )}
            Screen all pending
          </Button>
        )}
      </div>

      <div className="bg-card rounded-xl border px-4">
        {isLoading ? (
          <div className="space-y-3 py-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-between gap-3 py-3">
            <p className="text-muted-foreground text-sm">
              Couldn’t load screening state.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RotateCwIcon className="mr-1.5 size-3.5" />
              Retry
            </Button>
          </div>
        ) : !subjects || subjects.length === 0 ? (
          <p className="text-muted-foreground py-3 text-sm">
            No natural persons on this case to screen.
          </p>
        ) : (
          <div className="divide-border/70 divide-y">
            {subjects.map((subject) => (
              <SubjectRow
                key={subject.personId}
                subject={subject}
                isScreening={screeningIds.has(subject.personId)}
                onRun={() => runScreen(subject)}
                onReview={() => setReviewPersonId(subject.personId)}
              />
            ))}
          </div>
        )}
      </div>

      <ScreeningReviewSheet
        open={reviewPersonId !== null}
        onOpenChange={(open) => {
          if (!open) setReviewPersonId(null);
        }}
        organizationId={organizationId}
        personId={reviewPersonId}
        subjectContext={{
          birthYear: backingPerson?.dateOfBirth?.slice(0, 4),
          nationality: backingPerson?.nationalityCode,
        }}
      />
    </section>
  );
}
