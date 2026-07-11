import { Badge } from "@/components/ui/badge";
import type { BusinessPersonDto } from "@/lib/api/generated";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { CheckIcon, FileTextIcon, UserIcon, XIcon } from "lucide-react";
import { FlagButton } from "./flag-button";
import type { CaseFlagsApi } from "./use-case-flags";
import type { ComplianceCase, ScreeningResult } from "./types";

type CheckStatus = "passed" | "manual_review" | "failed";
type ReviewStatus = ComplianceCase["kybStatus"];

/** Honest wording for the provider's single identity verdict. */
const PROVIDER_RESULT_LABEL: Record<string, string> = {
  passed: "Verified",
  manual_review: "Needs review",
  failed: "Failed",
  pending: "In progress",
  none: "Not run",
};

/**
 * The automated-check result for a track: what the machine found. Kept visually
 * distinct from the review decision (below) so the two status vocabularies never
 * blur together. Manual corridors have no automated pass, so the check reads
 * "Reviewer-led".
 */
function ChecksValue({
  status,
  manual,
}: {
  status: CheckStatus;
  manual: boolean;
}) {
  if (manual) {
    return (
      <Badge variant="outline" className={cn("font-medium", TINT.gray)}>
        Reviewer-led
      </Badge>
    );
  }
  const map: Record<CheckStatus, { tint: string; label: string }> = {
    passed: { tint: TINT.green, label: "Passed" },
    manual_review: { tint: TINT.amber, label: "Manual review" },
    failed: { tint: TINT.red, label: "Failed" },
  };
  const { tint, label } = map[status];
  return (
    <Badge variant="outline" className={cn("font-medium", tint)}>
      {label}
    </Badge>
  );
}

/**
 * The reviewer's decision on the track: what a human chose (or has yet to).
 * `draft` shows up mid-flow — fulfilling a requested document returns the
 * profile to draft until the applicant resubmits.
 */
function DecisionValue({ status }: { status: ReviewStatus }) {
  const map: Record<ReviewStatus, { tint: string; label: string }> = {
    approved: { tint: TINT.green, label: "Approved" },
    action_required: { tint: TINT.amber, label: "Action requested" },
    pending_review: { tint: TINT.gray, label: "Pending" },
    submitted: { tint: TINT.blue, label: "Submitted" },
    draft: { tint: TINT.gray, label: "With applicant" },
  };
  const { tint, label } = map[status] ?? { tint: TINT.gray, label: status };
  return (
    <Badge variant="outline" className={cn("font-medium", tint)}>
      {label}
    </Badge>
  );
}

function CheckRow({
  label,
  value,
  flagTarget,
  flags,
}: {
  label: string;
  value: boolean | React.ReactNode;
  /** Reason target this row can be flagged against, if any. */
  flagTarget?: string;
  flags?: CaseFlagsApi;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === "boolean" ? (
          value ? (
            <CheckIcon className="size-4 text-green-600" />
          ) : (
            <XIcon className="text-muted-foreground/60 size-4" />
          )
        ) : typeof value === "string" ? (
          <span className="font-medium tabular-nums">{value || "—"}</span>
        ) : (
          value
        )}
        {flagTarget && flags && (
          <FlagButton target={flagTarget} flags={flags} compact />
        )}
      </div>
    </div>
  );
}

/**
 * A sanctions/PEP screening verdict. "Not run" is rendered deliberately — a
 * reviewer must be able to tell "screened clean" from "never screened"; hiding
 * the row would collapse the two.
 */
function ScreeningValue({ result }: { result?: ScreeningResult }) {
  if (!result) {
    return <span className="text-muted-foreground">Not run</span>;
  }
  const map: Record<ScreeningResult["status"], { tint: string; label: string }> =
    {
      passed: { tint: TINT.green, label: "Passed" },
      manual_review: { tint: TINT.amber, label: "Needs review" },
      failed: { tint: TINT.red, label: "Failed" },
    };
  const { tint, label } = map[result.status];
  return (
    <Badge variant="outline" className={cn("font-medium", tint)}>
      {label}
    </Badge>
  );
}

/**
 * Worst-state rollup of the stored people's AML screens for the one-glance
 * row; the AML screening panel below is its expansion. Merged humans share a
 * check, so screened rows dedupe by provider reference before counting.
 */
function PeopleScreeningValue({ people }: { people: BusinessPersonDto[] }) {
  const seen = new Set<string>();
  let needReview = 0;
  let failed = 0;
  let notRun = 0;
  for (const person of people) {
    const check = person.amlCheck;
    const key = check?.referenceId ?? `p-${person._id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!check || (check.status === "manual_review" && check.provider !== "smile_id")) {
      notRun += 1;
    } else if (check.status === "failed") failed += 1;
    else if (check.status === "manual_review") needReview += 1;
  }
  if (failed > 0) {
    return (
      <Badge variant="outline" className={cn("font-medium", TINT.red)}>
        Failed
      </Badge>
    );
  }
  if (needReview > 0) {
    return (
      <Badge variant="outline" className={cn("font-medium", TINT.amber)}>
        {needReview} need{needReview === 1 ? "s" : ""} review
      </Badge>
    );
  }
  if (notRun > 0) {
    return <span className="text-muted-foreground">Not run</span>;
  }
  return (
    <Badge variant="outline" className={cn("font-medium", TINT.green)}>
      Passed
    </Badge>
  );
}

function Track({
  icon,
  title,
  checks,
  decision,
  manual,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  checks: CheckStatus;
  decision: ReviewStatus;
  manual: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              manual ? "bg-muted text-muted-foreground" : TINT.teal,
            )}
          >
            {icon}
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
              Checks
            </span>
            <ChecksValue status={checks} manual={manual} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
              Decision
            </span>
            <DecisionValue status={decision} />
          </div>
        </div>
      </div>
      <div className="divide-border/70 divide-y">{children}</div>
    </div>
  );
}

/**
 * Compact two-track verification band. Replaces the two large automated-check
 * cards: it shows Identity (KYC) and Business (KYB) side by side, each surfacing
 * the automated Checks result beside the reviewer Decision. The actions moved to
 * the sticky decision bar, so this band is read-only.
 */
export function VerificationBand({
  data,
  flags,
  people,
}: {
  data: ComplianceCase;
  /** Case flag store; enables the inline "flag" control on check rows. */
  flags?: CaseFlagsApi;
  /** Stored directors + owners; drives the People screening rollup row. */
  people?: BusinessPersonDto[];
}) {
  const { checks, kybStatus, kycStatus, verificationMode } = data;
  const manual = verificationMode === "manual";

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Verification</h3>
        <span className="text-muted-foreground text-xs">
          {manual
            ? "Reviewer confirms each item on approval"
            : "Checks ran automatically. Confirm or send back."}
        </span>
      </div>
      <div className="bg-card grid grid-cols-1 divide-y overflow-hidden rounded-xl border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <Track
          icon={<UserIcon className="size-4" />}
          title="Identity (KYC)"
          checks={checks.kyc.status}
          decision={kycStatus}
          manual={manual}
        >
          {!data.hasKycProfile ? (
            <CheckRow label="Identity profile" value="Not submitted" />
          ) : (
            <>
              {manual ? (
                <>
                  <CheckRow
                    label="ID document"
                    value={!!checks.kyc.idType}
                    flagTarget="id_document"
                    flags={flags}
                  />
                  <CheckRow
                    label="Selfie"
                    value={checks.kyc.selfieProvided}
                    flagTarget="selfie_liveness"
                    flags={flags}
                  />
                </>
              ) : (
                <>
                  {/* One row on purpose: the provider returns a single verdict, and
                      splitting it into selfie/liveness/document rows would fabricate
                      granularity the data does not have. */}
                  <CheckRow
                    label="Provider verification"
                    value={
                      PROVIDER_RESULT_LABEL[checks.kyc.providerResult ?? "none"]
                    }
                    flagTarget="selfie_liveness"
                    flags={flags}
                  />
                  <CheckRow
                    label="ID type"
                    value={checks.kyc.idType}
                    flagTarget="id_document"
                    flags={flags}
                  />
                </>
              )}
              <CheckRow
                label="Sanctions screening"
                value={<ScreeningValue result={checks.kyc.sanctions} />}
              />
              <CheckRow
                label="PEP screening"
                value={<ScreeningValue result={checks.kyc.pep} />}
              />
              {/* Multi-member orgs: the rows above describe the primary member;
                  this row keeps the others from being invisible in the rollup. */}
              {data.members.length > 1 && (
                <CheckRow
                  label="Members approved"
                  value={`${data.members.filter((m) => m.status === "approved").length} of ${data.members.length}`}
                />
              )}
            </>
          )}
        </Track>

        <Track
          icon={<FileTextIcon className="size-4" />}
          title="Business (KYB)"
          checks={checks.kyb.status}
          decision={kybStatus}
          manual={manual}
        >
          {manual ? (
            <>
              <CheckRow
                label="Registration number"
                value={checks.kyb.rcNumber}
                flagTarget="rc_number"
                flags={flags}
              />
              <CheckRow
                label="Company name"
                value={checks.kyb.companyName}
                flagTarget="company_name"
                flags={flags}
              />
            </>
          ) : (
            <>
              <CheckRow
                label="RC number"
                value={checks.kyb.rcNumber}
                flagTarget="rc_number"
                flags={flags}
              />
              <CheckRow
                label="Company name"
                value={checks.kyb.companyName}
                flagTarget="company_name"
                flags={flags}
              />
              <CheckRow
                label="Directors found"
                value={String(checks.kyb.directorsFound)}
                flagTarget="director_info"
                flags={flags}
              />
              <CheckRow label="Registry source" value={checks.kyb.registrySource} />
            </>
          )}
          <CheckRow
            label="Sanctions screening"
            value={<ScreeningValue result={checks.kyb.sanctions} />}
          />
          {people && people.length > 0 && (
            <CheckRow
              label="People screening"
              value={<PeopleScreeningValue people={people} />}
            />
          )}
        </Track>
      </div>
    </section>
  );
}
