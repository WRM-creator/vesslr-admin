import { formatCurrency, getCurrencyDecimals } from "@/lib/currency";

export interface SellerFeePreviewInput {
  /** The disclosed seller charge, as the funding review reports it. */
  fee?: {
    method?: string;
    feePerUnit: number;
    percentage?: number;
    currency?: string;
    /** Unit a per-unit rate is quoted per. */
    unit?: string;
    minFee?: number;
    maxFee?: number;
  } | null;
  /** Deal quantity. */
  quantity: number;
  /** quantity x the agreed unit price, in settlement-currency minor units. */
  goodsTotal: number;
  /** The currency the deal settles in. */
  settlementCurrency: string;
  /** The benchmark currency the formula is quoted in. */
  formulaCurrency: string;
  /** The agreed settlement-per-formula rate in micros, 0 when not yet entered. */
  fxRateMicros: number;
  /** Whether this deal settles outside its formula currency. */
  requiresFxRate: boolean;
}

export interface SellerFeePreview {
  /** The fee formula-side, for the "X converted" caption. Zero for a percentage. */
  feeFormulaTotal: number;
  /** What the seller actually loses, in the settlement currency. */
  feeSettlementTotal: number;
}

/**
 * The admin's preview of the seller's charge, mirroring `calculateSellerFee`
 * and `convertFeeToSettlement` on the server. The admin confirms real money
 * against these figures, so a preview that does not match what the server will
 * do is worse than no preview at all.
 *
 * A PER-UNIT rate is an amount quoted on the formula: clamp formula-side, then
 * cross once at the agreed rate. A PERCENTAGE is a ratio with no currency of
 * its own, so it applies to the settlement goods total and never crosses; only
 * its clamps, being amounts, are crossed.
 */
export const sellerFeePreview = ({
  fee,
  quantity,
  goodsTotal,
  settlementCurrency,
  formulaCurrency,
  fxRateMicros,
  requiresFxRate,
}: SellerFeePreviewInput): SellerFeePreview => {
  if (!fee) return { feeFormulaTotal: 0, feeSettlementTotal: 0 };

  const toSettlement = (amountFormula: number) =>
    Math.round(
      (amountFormula *
        fxRateMicros *
        10 **
          (getCurrencyDecimals(settlementCurrency) -
            getCurrencyDecimals(formulaCurrency))) /
        1_000_000,
    );

  if (fee.method === "percentage") {
    const crossClamp = (bound: number) =>
      fee.currency && fee.currency !== settlementCurrency
        ? toSettlement(bound)
        : bound;
    let total = Math.round(goodsTotal * (fee.percentage ?? 0));
    if (fee.minFee != null) total = Math.max(total, crossClamp(fee.minFee));
    if (fee.maxFee != null) total = Math.min(total, crossClamp(fee.maxFee));
    return { feeFormulaTotal: 0, feeSettlementTotal: total };
  }

  let feeFormulaTotal = Math.round(fee.feePerUnit * quantity);
  if (fee.minFee != null)
    feeFormulaTotal = Math.max(feeFormulaTotal, fee.minFee);
  if (fee.maxFee != null)
    feeFormulaTotal = Math.min(feeFormulaTotal, fee.maxFee);

  return {
    feeFormulaTotal,
    feeSettlementTotal: !requiresFxRate
      ? feeFormulaTotal
      : fxRateMicros > 0
        ? toSettlement(feeFormulaTotal)
        : 0,
  };
};

export interface SellerFeeCaptionInput {
  fee: SellerFeePreviewInput["fee"];
  quantity: number;
  /** The deal's unit, used when the fee does not name its own. */
  unit: string;
  formulaCurrency: string;
  settlementCurrency: string;
  /** From `sellerFeePreview`. */
  feeFormulaTotal: number;
  requiresFxRate: boolean;
  /** The agreed rate in major units (settlement per formula), 0 when not entered. */
  fxRate: number;
}

/**
 * How the seller fee is worked out, for the line's label: the per-unit rate
 * times the quantity, and the agreed rate when it crosses currencies
 * ("$0.50/bbl x 2 bbl = $1 at 1,600 NGN/USD"). A percentage shows its rate.
 */
export const sellerFeeCaption = ({
  fee,
  quantity,
  unit,
  formulaCurrency,
  settlementCurrency,
  feeFormulaTotal,
  requiresFxRate,
  fxRate,
}: SellerFeeCaptionInput): string => {
  if (!fee) return "";
  const conversion = !requiresFxRate
    ? ""
    : fxRate > 0
      ? ` at ${fxRate.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${settlementCurrency}/${formulaCurrency}`
      : ", converted at the agreed rate";

  if (fee.method === "percentage") {
    const rate = `${Number(((fee.percentage ?? 0) * 100).toFixed(4))}% of goods`;
    const bounds = [
      fee.minFee != null && `min ${formatCurrency(fee.minFee, fee.currency ?? settlementCurrency)}`,
      fee.maxFee != null && `max ${formatCurrency(fee.maxFee, fee.currency ?? settlementCurrency)}`,
    ].filter(Boolean);
    return bounds.length ? `${rate}, ${bounds.join(", ")}` : rate;
  }

  const total = formatCurrency(feeFormulaTotal, formulaCurrency);
  if (fee.method !== "per_unit") return `${total}${conversion}`;

  const feeUnit = fee.unit ?? unit;
  const rate = formatCurrency(fee.feePerUnit, formulaCurrency);
  const qty = quantity.toLocaleString("en-US");
  const unclamped = Math.round(fee.feePerUnit * quantity);
  const base = `${rate}/${feeUnit} x ${qty} ${feeUnit}`;
  const amount =
    feeFormulaTotal > unclamped
      ? `${base}, minimum fee ${total}`
      : feeFormulaTotal < unclamped
        ? `${base}, maximum fee ${total}`
        : `${base} = ${total}`;
  return `${amount}${conversion}`;
};
