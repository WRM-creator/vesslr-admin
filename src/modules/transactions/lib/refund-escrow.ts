import type { TransactionResponseDto } from "@/lib/api/generated";

/**
 * Whether an admin may refund this escrow outside a dispute. The API checks
 * the same rules and has the last word; this only decides whether to offer it.
 */
export function canRefundEscrow(
  tx: Pick<TransactionResponseDto, "status" | "escrow">,
): boolean {
  const escrow = tx.escrow;
  if (!escrow || escrow.status !== "FUNDED") return false;
  if (
    [
      "DISPUTED",
      "SETTLEMENT_RELEASED",
      "CLOSED",
      "CANCELLED",
      "REFUNDED",
      "PARTIALLY_REFUNDED",
    ].includes(tx.status)
  ) {
    return false;
  }
  return (escrow.milestonePayouts ?? []).every((p) => p.status === "PENDING");
}

