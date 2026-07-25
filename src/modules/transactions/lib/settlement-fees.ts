import type { TransactionResponseDto } from "@/lib/api/generated";

/**
 * The two-fee split for a funded transaction, ready for display.
 *
 * Two-fee model: the buyer pays goods + escrow fee (added on top); the seller
 * receives goods − service charge (deducted from earnings); the platform earns
 * both. Each amount is in the escrow's minor currency units (pass to
 * `formatCurrency`, which converts).
 *
 * At settlement the escrow is authoritative: it holds what the buyer actually
 * funded (`amount`), the realized seller payout (`sellerAmount`), and the
 * combined platform take (`serviceFeeAmount`). We split that combined take back
 * into its two halves so the release surfaces can show each fee separately
 * instead of one conflated line.
 */
export interface SettlementFees {
  currency: string;
  /** Goods subtotal (before any fee). */
  goodsAmount: number;
  /** Total the buyer funded into escrow (goods + escrow fee). */
  escrowHeld: number;
  /** Buyer-paid escrow fee, added on top of goods. */
  escrowFeeAmount: number;
  /** Seller-paid service charge, deducted from goods. */
  serviceChargeAmount: number;
  /** Net amount released to the seller (goods − service charge). */
  sellerPayout: number;
  /** Total platform take (escrow fee + service charge). */
  platformRevenue: number;
  /** Effective escrow-fee rate against goods (e.g. 0.01), or undefined when goods is 0. */
  escrowFeeRate?: number;
  /** Effective service-charge rate against goods (e.g. 0.03), or undefined when goods is 0. */
  serviceChargeRate?: number;
}

/**
 * Effective rate of a fee against the goods base. Derived from the realized
 * amounts (not a config field, which the admin SDK does not expose on the
 * order), so it always matches what was actually charged — 1% / 3% for flat
 * deals, and the true effective proportion for a per-unit commodity charge.
 */
const rateAgainstGoods = (
  fee: number,
  goods: number,
): number | undefined => (goods > 0 && fee > 0 ? fee / goods : undefined);

/**
 * Derive the escrow-authoritative two-fee split for a transaction. Safe when
 * the escrow predates the two-fee model: a fee resolves to 0 and its line is
 * simply omitted by callers (each renders only when > 0).
 */
export function deriveSettlementFees(
  transaction: TransactionResponseDto,
): SettlementFees {
  const order = transaction.order;
  const escrow = transaction.escrow;

  const currency = escrow?.currency ?? order.currency ?? "USD";
  const goodsAmount = order.totalAmount ?? 0;
  const escrowHeld = escrow?.amount ?? order.totalWithFee ?? goodsAmount;
  const platformRevenue = escrow?.serviceFeeAmount ?? 0;
  const sellerPayout = escrow?.sellerAmount ?? goodsAmount;

  // The buyer fee is whatever was funded on top of the goods; the remainder of
  // the combined take is the seller's service charge. Clamped so a legacy shape
  // never produces a negative line.
  const escrowFeeAmount = Math.max(0, escrowHeld - goodsAmount);
  const serviceChargeAmount = Math.max(0, platformRevenue - escrowFeeAmount);

  return {
    currency,
    goodsAmount,
    escrowHeld,
    escrowFeeAmount,
    serviceChargeAmount,
    sellerPayout,
    platformRevenue,
    escrowFeeRate: rateAgainstGoods(escrowFeeAmount, goodsAmount),
    serviceChargeRate: rateAgainstGoods(serviceChargeAmount, goodsAmount),
  };
}

/** A ` (3%)`-style suffix for a percentage rate, or "" when not a percentage. */
export function ratePercentLabel(rate: number | undefined): string {
  if (rate == null) return "";
  return ` (${+(rate * 100).toFixed(2)}%)`;
}
