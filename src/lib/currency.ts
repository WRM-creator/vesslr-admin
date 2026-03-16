interface FormatCurrencyOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

/**
 * Format a monetary amount (in **minor units**) with its currency symbol.
 *
 * All API values are in minor units (kobo/cents). This function converts
 * to major units internally before formatting.
 *
 * @example
 * formatCurrency(5000000, 'NGN')                                  // '₦50,000'
 * formatCurrency(123456, 'USD', { maximumFractionDigits: 2 })     // '$1,234.56'
 * formatCurrency(150000000, 'NGN', { compact: true })             // '₦1.5M'
 * formatCurrency(null, 'USD')                                     // '-'
 */
export function formatCurrency(
  amountInMinorUnits: number | null | undefined,
  currency: string = "NGN",
  options: FormatCurrencyOptions = {},
): string {
  if (amountInMinorUnits == null || isNaN(amountInMinorUnits)) return "-";

  const majorAmount = fromMinorUnit(amountInMinorUnits);

  const {
    locale = "en-US",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...(compact && { notation: "compact" as const, compactDisplay: "short" as const }),
  }).format(majorAmount);
}

const MINOR_UNIT_MULTIPLIERS: Record<string, number> = {
  NGN: 100,
  USD: 100,
  EUR: 100,
  GBP: 100,
};

const DEFAULT_MULTIPLIER = 100;

/** Convert minor units from API to major units for display. */
export function fromMinorUnit(amount: number, currency: string = "NGN"): number {
  const multiplier = MINOR_UNIT_MULTIPLIERS[currency] ?? DEFAULT_MULTIPLIER;
  return amount / multiplier;
}

/** Convert user input (major units) to minor units for API submission. */
export function toMinorUnit(amount: number, currency: string = "NGN"): number {
  const multiplier = MINOR_UNIT_MULTIPLIERS[currency] ?? DEFAULT_MULTIPLIER;
  return Math.round(amount * multiplier);
}
