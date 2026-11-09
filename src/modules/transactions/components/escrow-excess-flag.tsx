import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { TriangleAlert } from "lucide-react";

/**
 * The buyer paid more than the escrow needed. The excess is held outside the
 * escrow; an admin moves it to the buyer's wallet (no in-app action yet).
 */
export function EscrowExcessFlag({
  transaction,
}: {
  transaction: TransactionResponseDto;
}) {
  const escrow = transaction.escrow;
  const excess = escrow?.excessAmount ?? 0;
  if (!escrow || excess <= 0) return null;

  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/20">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Overpaid by{" "}
          <span className="tabular-nums">
            {formatCurrency(excess, escrow.currency, {
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-400">
          The buyer paid more than this escrow needed. The excess is held
          outside the escrow and must be moved to the buyer's wallet.
        </p>
      </div>
    </div>
  );
}
