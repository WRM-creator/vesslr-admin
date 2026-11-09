import type { TransactionResponseDto } from "@/lib/api/generated";

type RefundView = Pick<TransactionResponseDto, "status" | "escrow">;

/**
 * A full refund was sent and the provider failed it: the escrow is FUNDED
 * again and still owed to the buyer, and the refund can be resent.
 */
export function isRefundOwed(tx: RefundView): boolean {
  const escrow = tx.escrow;
  return (
    tx.status === "REFUNDED" &&
    escrow?.status === "FUNDED" &&
    (escrow.refundHistory ?? []).some((h) => h.type === "FULL")
  );
}

/**
 * Whether an admin may refund this escrow outside a dispute, or resend a
 * refund the provider failed. The API checks the same rules and has the last
 * word; this only decides whether to offer it.
 */
export function canRefundEscrow(tx: RefundView): boolean {
  if (isRefundOwed(tx)) return true;
  const escrow = tx.escrow;
  if (!escrow || escrow.status !== "FUNDED") return false;
  if ((escrow.refundHistory ?? []).some((h) => h.type === "FULL")) return false;
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
