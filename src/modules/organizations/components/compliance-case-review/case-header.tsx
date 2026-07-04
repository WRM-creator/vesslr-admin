import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { CorridorBadge } from "../corridor-badge";
import { STATUS_LABEL, STATUS_VARIANT } from "../compliance-worklist/status";
import { formatAccountType } from "./compliance-utils";
import type { ComplianceCase } from "./types";

/** Cases waiting longer than this read as overdue (mirrors the worklist). */
const OVERDUE_AFTER_DAYS = 3;

function Waiting({ submittedAt }: { submittedAt?: string }) {
  if (!submittedAt) return null;
  const date = new Date(submittedAt);
  const overdue =
    Date.now() - date.getTime() > OVERDUE_AFTER_DAYS * 24 * 60 * 60 * 1000;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        overdue && "text-destructive font-medium",
      )}
    >
      Waiting{" "}
      <span className="tabular-nums">
        {formatDistanceToNowStrict(date)}
      </span>
      {overdue && " · overdue"}
    </span>
  );
}

function Dot() {
  return <span className="bg-border size-[3px] shrink-0 rounded-full" />;
}

/**
 * Sticky case-summary header. Pins the who/where/how-long context to the top of
 * the case so it is never lost on scroll: organization, country, corridor,
 * participant role, submitter, waiting age (with an overdue state), and the
 * overall compliance status.
 */
export function CaseHeader({ data }: { data: ComplianceCase }) {
  const { organization, summary, verificationMode } = data;
  const accountType = formatAccountType(summary.accountType);

  return (
    <div className="bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-20 -mx-1 border-b px-1 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild className="size-8 shrink-0">
          <Link to="/registrations" aria-label="Back to compliance review">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">
          {organization.name || "Registration review"}
        </h2>
        <StatusBadge
          status={STATUS_LABEL[summary.complianceStatus]}
          variant={STATUS_VARIANT[summary.complianceStatus]}
        />
      </div>

      <div className="text-muted-foreground mt-2.5 ml-11 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        {organization.countryCode && (
          <span className="text-foreground font-medium">
            {organization.countryCode}
          </span>
        )}
        <CorridorBadge mode={verificationMode} className="px-1.5 py-0" />
        {accountType && (
          <>
            <Dot />
            <span>{accountType}</span>
          </>
        )}
        {summary.submitterEmail && (
          <>
            <Dot />
            <span>
              by{" "}
              <span className="text-foreground font-medium">
                {summary.submitterEmail}
              </span>
            </span>
          </>
        )}
        {summary.submittedAt && (
          <>
            <Dot />
            <Waiting submittedAt={summary.submittedAt} />
          </>
        )}
      </div>
    </div>
  );
}
