import type {
  ServiceFeeConfigDto,
  TransactionResponseDto,
} from "@/lib/api/generated";

/**
 * Fee figures for admin's transaction surfaces.
 *
 * Two-fee model: the buyer pays goods + escrow fee (added on top); the seller
 * receives goods − service charge (deducted from earnings); the platform earns
 * both. Amounts are minor units (pass to `formatCurrency`, which converts).
 *
 * The split comes from the order's frozen snapshots when it has them: they
 * are the fees as charged. A dispute discount lowers the escrow's held amount
 * and seller share but not the platform take, so the split is never inferred
 * from the escrow while a snapshot exists.
 */

type OrderWithFees = TransactionResponseDto["order"] & {
  // The API serializes these on the order; the admin SDK's OrderResponseDto
  // does not declare them yet.
  frozenSellerFee?: { feeSettlementAmount?: number };
  frozenEscrowFee?: { feeAmount?: number };
  serviceChargeConfig?: ServiceFeeConfigDto;
};

const orderOf = (transaction: TransactionResponseDto) =>
  transaction.order as OrderWithFees;

export const isDifferentialOrder = (transaction: TransactionResponseDto) =>
  transaction.order?.pricingBasis === "differential" &&
  !!transaction.order?.differentialPrice;

/**
 * Whether the escrow's figures are in the order's units and describe the
 * whole deal. Not so for a legacy USD order held in USDT (other units), or a
 * DEPOSIT-structure escrow (it holds and pays only the deposit slice).
 */
function escrowMatchesOrder(transaction: TransactionResponseDto): boolean {
  const escrow = transaction.escrow;
  const order = transaction.order;
  if (!escrow || escrow.currency !== order.currency) return false;
  const funded = escrow.originalFundedAmount ?? escrow.amount;
  return funded >= (order.totalAmount ?? 0);
}

export interface SettlementFees {
  currency: string;
  /** Goods subtotal (before any fee). */
  goodsAmount: number;
  /** Total held in escrow (goods + escrow fee, less any discount). */
  escrowHeld: number;
  /** Net amount released to the seller. */
  sellerPayout: number;
  /** Total platform take (escrow fee + service charge). */
  platformRevenue: number;
  /**
   * The take split into its two fees, or null when it cannot be split
   * reliably (no snapshot and the escrow is not in the order's units or
   * holds only a deposit): show the combined take then.
   */
  split: {
    escrowFeeAmount: number;
    serviceChargeAmount: number;
    /** Effective escrow-fee rate against goods (e.g. 0.01). */
    escrowFeeRate?: number;
    /** The service-charge rate, only when it is a percentage. */
    serviceChargeRate?: number;
  } | null;
}

const rateAgainstGoods = (fee: number, goods: number): number | undefined =>
  goods > 0 && fee > 0 ? fee / goods : undefined;

/** The escrow-authoritative figures for the release surfaces. */
export function deriveSettlementFees(
  transaction: TransactionResponseDto,
): SettlementFees {
  const order = orderOf(transaction);
  const escrow = transaction.escrow;

  const currency = escrow?.currency ?? order.currency ?? "USD";
  const goodsAmount = order.totalAmount ?? 0;
  const escrowHeld = escrow?.amount ?? order.totalWithFee ?? goodsAmount;
  const platformRevenue = escrow?.serviceFeeAmount ?? 0;
  // The API pays `sellerAmount || amount`: a 0 means unset, not "pay nothing".
  const sellerPayout = escrow ? escrow.sellerAmount || escrow.amount : goodsAmount;

  const frozenEscrowFee = order.frozenEscrowFee?.feeAmount;
  const frozenCharge = order.frozenSellerFee?.feeSettlementAmount;
  let split: SettlementFees["split"] = null;
  if (
    frozenEscrowFee != null &&
    frozenCharge != null &&
    frozenEscrowFee + frozenCharge === platformRevenue
  ) {
    split = { escrowFeeAmount: frozenEscrowFee, serviceChargeAmount: frozenCharge };
  } else if (frozenCharge != null && frozenCharge <= platformRevenue) {
    split = {
      escrowFeeAmount: platformRevenue - frozenCharge,
      serviceChargeAmount: frozenCharge,
    };
  } else if (escrowMatchesOrder(transaction)) {
    // Legacy escrow, no snapshot: the buyer fee is what was funded on top of
    // the goods, the rest of the take is the seller's charge.
    const escrowFeeAmount = Math.max(0, escrowHeld - goodsAmount);
    split = {
      escrowFeeAmount,
      serviceChargeAmount: Math.max(0, platformRevenue - escrowFeeAmount),
    };
  }
  if (split) {
    split.escrowFeeRate = rateAgainstGoods(split.escrowFeeAmount, goodsAmount);
    split.serviceChargeRate =
      order.serviceChargeConfig?.feeType === "percentage"
        ? rateAgainstGoods(split.serviceChargeAmount, goodsAmount)
        : undefined;
  }

  return { currency, goodsAmount, escrowHeld, sellerPayout, platformRevenue, split };
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
  /** Seller-paid service charge. Null when it is only known at funding. */
  serviceChargeAmount: number | null;
  /** What the seller receives. Null when the charge is not known yet. */
  sellerPayout: number | null;
  /** True while the service charge is computed from config, not frozen. */
  chargeIsEstimate: boolean;
}

/**
 * A seller charge estimated from the order's config before it is frozen, as
 * the API's calculateSellerFee computes it. Null when the config is quoted in
 * another currency (a commodity rate crossed at funding) or is a shape the
 * admin cannot reproduce (tiered).
 */
function estimateServiceCharge(order: OrderWithFees): number | null {
  const config = order.serviceChargeConfig;
  if (!config) return 0;
  const sameCurrency = !config.currency || config.currency === order.currency;
  const clamp = (fee: number) => {
    if (!sameCurrency) return fee;
    if (config.minFee != null) fee = Math.max(fee, config.minFee);
    if (config.maxFee != null) fee = Math.min(fee, config.maxFee);
    return fee;
  };
  switch (config.feeType) {
    case "percentage":
      return clamp(Math.round((order.totalAmount || 0) * (config.percentage ?? 0)));
    case "fixed":
      return sameCurrency ? clamp(config.fixedAmount ?? 0) : null;
    case "per_unit":
      return sameCurrency
        ? clamp(Math.round((config.perUnitAmount ?? 0) * (order.quantity ?? 0)))
        : null;
    default:
      return null;
  }
}

/**
 * The two-fee split for the overview, the financials card and the sidebar,
 * in the order's units. The fees come from the frozen snapshots, else from
 * config. The payout is the escrow's realized `sellerAmount` when the escrow
 * is in the order's units and covers the whole deal, else goods − charge.
 * On a differential order the buyer pays exactly the listed price, so there
 * is no buyer fee, and an unfrozen order's serviceFeeAmount IS the seller's
 * charge.
 */
export function deriveOrderFees(transaction: TransactionResponseDto): OrderFees {
  const order = orderOf(transaction);
  const isDifferential = isDifferentialOrder(transaction);
  const goodsAmount = order.totalAmount || 0;
  const serviceFeeAmount = order.serviceFeeAmount ?? 0;
  const frozenCharge = order.frozenSellerFee?.feeSettlementAmount;

  const serviceChargeAmount =
    frozenCharge ??
    (isDifferential ? serviceFeeAmount : estimateServiceCharge(order));
  const escrowFeeAmount =
    order.frozenEscrowFee?.feeAmount ?? (isDifferential ? 0 : serviceFeeAmount);

  const escrow = transaction.escrow;
  const realized =
    escrow && escrowMatchesOrder(transaction) && escrow.sellerAmount > 0
      ? escrow.sellerAmount
      : null;

  return {
    escrowFeeAmount,
    serviceChargeAmount,
    sellerPayout:
      realized ??
      (serviceChargeAmount == null ? null : goodsAmount - serviceChargeAmount),
    chargeIsEstimate:
      !isDifferential && frozenCharge == null && realized == null,
  };
}
