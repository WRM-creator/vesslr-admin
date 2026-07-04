import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type {
  ProviderOnboardingOutcomeDto,
  ProviderOnboardingStatusDto,
} from "@/lib/api/generated";

interface ProviderOnboardingPanelProps {
  items: ProviderOnboardingStatusDto[];
  /** True once KYB is approved — onboarding only runs for approved orgs. */
  canRetry: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  /** Result of the last manual run this session — its `missing[]` says exactly
   * why provisioning deferred, which used to be silently discarded. */
  lastOutcome?: ProviderOnboardingOutcomeDto;
}

/** The last run's result, spelled out — especially the deferred-because list. */
function OutcomeNote({ outcome }: { outcome: ProviderOnboardingOutcomeDto }) {
  if (outcome.status === "incomplete") {
    return (
      <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/40">
        <p className="font-medium">
          Provisioning deferred — the provider still needs:
        </p>
        <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-4">
          {(outcome.missing ?? []).map((m) => (
            <li key={m.field}>{m.reason}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (outcome.status === "noop") {
    return (
      <p className="text-muted-foreground mt-3 text-xs">
        Nothing to do{outcome.reason ? `: ${outcome.reason}` : "."}
      </p>
    );
  }
  return (
    <p className="mt-3 text-xs text-green-700">
      Onboarding ran{outcome.bindingStatus ? ` (${outcome.bindingStatus})` : ""}
      .
    </p>
  );
}

type Status = ProviderOnboardingStatusDto["status"];

/** Human label for a provider key; falls back to a capitalized key. */
const PROVIDER_LABELS: Record<string, string> = {
  busha: "Busha",
  flutterwave: "Flutterwave",
  fake: "Fake (dev)",
};

function providerLabel(provider: string): string {
  return (
    PROVIDER_LABELS[provider] ??
    provider.charAt(0).toUpperCase() + provider.slice(1)
  );
}

const STATUS_LABELS: Record<Status, string> = {
  none: "Not started",
  pending: "Pending",
  in_review: "In review",
  active: "Verified",
  rejected: "Rejected",
};

function statusVariant(
  status: Status,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "rejected":
      return "destructive";
    case "in_review":
    case "pending":
      return "outline";
    case "none":
    default:
      return "secondary";
  }
}

/** A provider in one of these states can benefit from a manual (re-)run. */
const RETRYABLE: Status[] = ["none", "pending", "rejected"];

/**
 * OPS/ADMIN-ONLY status board for the org's payment-provider onboarding. One row
 * per onboarding-capable provider the org is bound to (provider-agnostic — any new
 * provider appears automatically). Names the provider, so never shown to customers.
 *
 * Status is the persisted binding state, kept current by each provider's
 * verification webhook; the retry button re-runs onboarding (e.g. after a rejection
 * or to backfill a principal).
 */
export function ProviderOnboardingPanel({
  items,
  canRetry,
  isRetrying,
  onRetry,
  lastOutcome,
}: ProviderOnboardingPanelProps) {
  const list = items ?? [];
  const isEmpty = list.length === 0;

  // Nothing to show and no action possible — onboarding only runs post-approval.
  if (isEmpty && !canRetry) return null;

  // Once approved, always offer the action: an empty board means onboarding hasn't
  // run, and a non-empty one may carry a retryable (rejected/pending) provider.
  const showRetry =
    canRetry && (isEmpty || list.some((i) => RETRYABLE.includes(i.status)));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Payment Provider Onboarding</CardTitle>
        {showRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying && <Spinner className="mr-2 size-3" />}
            {isEmpty ? "Run onboarding" : "Re-run onboarding"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="text-muted-foreground text-sm">
            No payment provider onboarding yet. Run onboarding to register this
            organization with its payment providers.
          </p>
        ) : (
          <div className="divide-y">
            {list.map((item) => (
            <div
              key={item.provider}
              className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {providerLabel(item.provider)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {item.currencies.length > 0
                    ? item.currencies.join(", ")
                    : "No currencies"}
                  {item.principalId ? ` · ${item.principalId}` : ""}
                </span>
              </div>
              <Badge variant={statusVariant(item.status)}>
                {STATUS_LABELS[item.status] ?? item.status}
              </Badge>
            </div>
            ))}
          </div>
        )}
        {lastOutcome && <OutcomeNote outcome={lastOutcome} />}
      </CardContent>
    </Card>
  );
}
