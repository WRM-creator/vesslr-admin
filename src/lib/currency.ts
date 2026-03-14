interface FormatCurrencyOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

/**
 * Format a monetary amount with its currency symbol.
 *
 * @example
 * formatCurrency(50000, 'NGN')                                    // '₦50,000'
 * formatCurrency(1234.56, 'USD', { maximumFractionDigits: 2 })    // '$1,234.56'
 * formatCurrency(1500000, 'NGN', { compact: true })               // '₦1.5M'
 * formatCurrency(null, 'USD')                                     // '-'
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "NGN",
  options: FormatCurrencyOptions = {},
): string {
  if (amount == null || isNaN(amount)) return "-";

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
  }).format(amount);
}
