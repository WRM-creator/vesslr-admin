import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { BanIcon, CheckIcon, FlagIcon, Undo2Icon } from "lucide-react";
import type { ComplianceCase } from "./types";

interface DecisionBarProps {
  data: ComplianceCase;
  onApprove: () => void;
  onRequestChanges: () => void;
  isSubmitting: boolean;
  /** Count of inline-flagged issues, shown as a running tally. */
  flagCount: number;
}

/** One-line statement of what the decision will act on. */
function contextLabel(pendingKyb: boolean, pendingKyc: boolean): string {
  if (pendingKyb && pendingKyc) return "Deciding identity + business";
  if (pendingKyb) return "Deciding Business (KYB). Identity already passed.";
  if (pendingKyc) return "Deciding Identity (KYC). Business already approved.";
  return "This case is fully approved.";
}

/**
 * Sticky decision bar. Keeps the case-level actions reachable no matter how far
 * the reviewer has scrolled through the evidence, and states what the decision
 * acts on. Approve and Request changes are live; Reject is a deferred placeholder
 * (needs its own terminal-decline lifecycle) shown disabled so the full decision
 * set reads at a glance.
 */
export function DecisionBar({
  data,
  onApprove,
  onRequestChanges,
  isSubmitting,
  flagCount,
}: DecisionBarProps) {
  const pendingKyb = data.kybStatus !== "approved";
  const pendingKyc = data.kycStatus !== "approved";
  const fullyApproved = !pendingKyb && !pendingKyc;

  return (
    <div className="bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky bottom-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 border-t px-1 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5">
        {flagCount > 0 && (
          <Badge
            variant="outline"
            className={cn("gap-1 font-medium", TINT.amber)}
          >
            <FlagIcon className="size-3" />
            {flagCount} flagged
          </Badge>
        )}
        <p className="text-muted-foreground text-xs">
          {contextLabel(pendingKyb, pendingKyc)}
        </p>
      </div>

      {!fullyApproved && (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Wrapper span so the tooltip still fires on a disabled button. */}
              <span tabIndex={0}>
                <Button variant="outline" size="sm" disabled className="gap-1.5">
                  <BanIcon className="size-4" />
                  Reject
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Rejection is coming soon. Its terminal-decline flow is still being
              built.
            </TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onRequestChanges}
            disabled={isSubmitting}
          >
            <Undo2Icon className="size-4" />
            Request changes
            {flagCount > 0 && (
              <span className="bg-muted ml-0.5 rounded-full px-1.5 text-[11px] tabular-nums">
                {flagCount}
              </span>
            )}
          </Button>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={onApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <CheckIcon className="size-4" />
            )}
            {pendingKyb && pendingKyc
              ? "Approve & verify"
              : pendingKyb
                ? "Approve business"
                : "Approve identity"}
          </Button>
        </div>
      )}
    </div>
  );
}
