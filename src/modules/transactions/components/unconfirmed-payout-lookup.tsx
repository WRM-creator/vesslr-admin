import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Clock, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { unconfirmedPayout } from "./unconfirmed-payout";

/**
 * A payout whose outcome never came back from the provider. "Check with
 * provider" looks it up there and settles it from the answer: delivered,
 * failed (resendable), still pending, or never received (reversed and
 * resendable).
 */
export function UnconfirmedPayoutLookup({
  transaction,
}: {
  transaction: TransactionResponseDto;
}) {
  const lookup = api.admin.providerPayouts.resolveForTransaction.useMutation({
    onSuccess: (res) =>
      res?.outcome === "pending"
        ? toast.info(res.message)
        : toast.success(res?.message ?? "Checked with the provider."),
    onError: (err) => toast.error(`Check failed: ${(err as Error).message}`),
  });
  const payout = unconfirmedPayout(
    transaction.escrow,
    transaction.escrowFunding,
  );
  if (!payout) return null;
  const tooSoon = payout.lookupFrom != null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="min-w-0 space-y-0.5">
        <p className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
          <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          {payout.label} not confirmed
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-400">
          {tooSoon
            ? `The provider hasn't confirmed it yet. It can be checked from ${formatDateTime(payout.lookupFrom!.toISOString())}.`
            : "The provider never confirmed it. Check with the provider to settle it from its record."}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => lookup.mutate({ path: { id: transaction._id } })}
        disabled={tooSoon || lookup.isPending}
      >
        {lookup.isPending ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
        ) : (
          <Search className="mr-1.5 size-3.5" />
        )}
        Check with provider
      </Button>
    </div>
  );
}
