import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { CheckIcon, FileTextIcon, UserIcon, XIcon } from "lucide-react";
import { FlagButton } from "./flag-button";
import type { CaseFlagsApi } from "./use-case-flags";
import type { ComplianceCase } from "./types";

type CheckStatus = "passed" | "manual_review" | "failed";
type ReviewStatus = ComplianceCase["kybStatus"];

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
  value: boolean | string;
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
        ) : (
          <span className="font-medium tabular-nums">{value || "—"}</span>
        )}
        {flagTarget && flags && (
          <FlagButton target={flagTarget} flags={flags} compact />
        )}
      </div>
    </div>
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
}: {
  data: ComplianceCase;
  /** Case flag store; enables the inline "flag" control on check rows. */
  flags?: CaseFlagsApi;
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
                value={kycStatus === "approved"}
                flagTarget="selfie_liveness"
                flags={flags}
              />
            </>
          ) : (
            <>
              <CheckRow
                label="Selfie match"
                value={checks.kyc.selfieMatch}
                flagTarget="selfie_liveness"
                flags={flags}
              />
              <CheckRow label="Liveness" value={checks.kyc.liveness} />
              <CheckRow label="Document auth" value={checks.kyc.documentAuth} />
              <CheckRow
                label="ID type"
                value={checks.kyc.idType}
                flagTarget="id_document"
                flags={flags}
              />
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
            <CheckRow
              label="Confirmed on approval"
              value={kybStatus === "approved"}
            />
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
        </Track>
      </div>
    </section>
  );
}
