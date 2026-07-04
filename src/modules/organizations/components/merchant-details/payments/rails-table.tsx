import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyButton } from "@/components/shared/copy-button";
import { TINT } from "@/lib/tint";
import type { AdminProviderBindingDto } from "@/lib/api/generated";
import { format } from "date-fns";

/** Same status vocabulary as the compliance ProviderOnboardingPanel. */
const STATUS_LABELS: Record<string, string> = {
  none: "Ready",
  pending: "Pending",
  in_review: "In review",
  active: "Verified",
  rejected: "Rejected",
};

const STATUS_TINTS: Record<string, string> = {
  none: TINT.green,
  active: TINT.green,
  pending: TINT.amber,
  in_review: TINT.amber,
  rejected: TINT.red,
};

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

const OUTCOME_LABELS: Record<string, string> = {
  created: "Customer created",
  resubmitted: "Verification resubmitted",
  status_refreshed: "Status refreshed",
  reconciled: "Updated by reconciler",
  webhook_update: "Updated by provider",
  incomplete: "Deferred, data missing",
  error: "Failed",
};

interface RailsTableProps {
  bindings: AdminProviderBindingDto[];
}

/**
 * The factual layer: one row per currency rail. Currency anchors the row
 * (admins think "their NGN wallet"); the provider is an attribute of it.
 */
export function RailsTable({ bindings }: RailsTableProps) {
  if (bindings.length === 0) return null;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Funding account</TableHead>
            <TableHead>Customer ref</TableHead>
            <TableHead>Last activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bindings.map((binding) => (
            <TableRow key={`${binding.provider}-${binding.currency}`}>
              <TableCell className="font-medium">{binding.currency}</TableCell>
              <TableCell className="text-muted-foreground">
                {providerLabel(binding.provider)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[11px] ${
                      STATUS_TINTS[binding.onboardingStatus] ?? ""
                    }`}
                  >
                    {STATUS_LABELS[binding.onboardingStatus] ??
                      binding.onboardingStatus}
                  </Badge>
                  {binding.status === "disabled" && (
                    <Badge variant="outline" className={`text-[11px] ${TINT.red}`}>
                      Disabled
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {binding.fundingAccount ? (
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span>{binding.fundingAccount.accountNumber}</span>
                    <span className="text-muted-foreground font-sans">
                      {binding.fundingAccount.bankName}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </TableCell>
              <TableCell>
                {binding.principalId ? (
                  <div className="flex items-center gap-1">
                    <span className="max-w-[140px] truncate font-mono text-xs">
                      {binding.principalId}
                    </span>
                    <CopyButton value={binding.principalId} />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </TableCell>
              <TableCell>
                {binding.lastAttemptAt ? (
                  <div className="text-xs">
                    <p>
                      {OUTCOME_LABELS[binding.lastOutcome ?? ""] ??
                        binding.lastOutcome ??
                        "Touched"}
                    </p>
                    <p className="text-muted-foreground">
                      {format(
                        new Date(binding.lastAttemptAt),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </p>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    No attempts recorded
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
