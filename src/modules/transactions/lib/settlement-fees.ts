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

/** The order's two fees and the seller's net, in the order's minor units. */
export interface OrderFees {
  /** Buyer-paid escrow fee, added on top of goods. */
  escrowFeeAmount: number;
  /** Seller-paid service charge, deducted from goods. */
  serviceChargeAmount: number;
  /** What the seller receives: goods − service charge. */
  sellerPayout: number;
  /** True while the service charge is computed from config, not frozen. */
  chargeIsEstimate: boolean;
}

/**
 * The two-fee split as the ORDER states it, before or after funding. The
 * buyer pays goods + escrow fee; the seller receives goods − service charge.
 * On a differential order the buyer-side fee is zero (the buyer pays exactly
 * the listed price) and the order's serviceFeeAmount IS the seller's charge.
 * Once the escrow exists its `sellerAmount` is the realized payout and wins.
 */
export function deriveOrderFees(
  transaction: TransactionResponseDto,
  isDifferential: boolean,
): OrderFees {
  const order = transaction.order;
  const goodsAmount = order.totalAmount || 0;
  const serviceFeeAmount = order.serviceFeeAmount ?? 0;

  // The API serializes the frozen fee snapshots, but the admin SDK's
  // OrderResponseDto does not declare them yet.
  const orderFees = order as unknown as {
    frozenSellerFee?: { feeSettlementAmount?: number };
    frozenEscrowFee?: { feeAmount?: number };
    serviceChargeConfig?: { feeType?: string; percentage?: number };
  };
  const frozenCharge = orderFees.frozenSellerFee?.feeSettlementAmount;
  const chargeConfig = orderFees.serviceChargeConfig;
  const serviceChargeAmount =
    frozenCharge ??
    (chargeConfig?.feeType === "percentage" && chargeConfig.percentage
      ? Math.round(goodsAmount * chargeConfig.percentage)
      : isDifferential
        ? serviceFeeAmount
        : 0);
  // On a differential order frozen before the two-fee model, serviceFeeAmount
  // was the SELLER's charge, so it must not be read as a buyer fee: the
  // absence of frozenEscrowFee is what identifies that shape.
  const escrowFeeAmount =
    orderFees.frozenEscrowFee?.feeAmount ??
    (isDifferential ? 0 : serviceFeeAmount);

  return {
    escrowFeeAmount,
    serviceChargeAmount,
    sellerPayout:
      transaction.escrow?.sellerAmount ?? goodsAmount - serviceChargeAmount,
    chargeIsEstimate: !isDifferential && frozenCharge == null,
  };
}
