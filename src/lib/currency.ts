interface FormatCurrencyOptions {
  locale?: string;
  /** Abbreviate (₦1.5M) for KPI tiles. Never use it where the exact figure matters. */
  compact?: boolean;
}

/**
 * Decimal places (scale = 10^decimals) per supported currency — mirrors the
 * backend registry in api/src/common/utils/currency.ts. Fiat uses 2; crypto
 * uses more (USDT = 6). Anything not listed falls back to 2.
 */
const CURRENCY_DECIMALS: Record<string, number> = {
  NGN: 2,
  KES: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  USDT: 6,
  USDC: 6,
};

const DEFAULT_DECIMALS = 2;

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency] ?? DEFAULT_DECIMALS;
}

/**
 * Currencies Intl.NumberFormat cannot render (non-ISO-4217 codes like USDT
 * throw a RangeError). These format as a plain number with the code suffixed.
 */
const NON_ISO_CURRENCIES = new Set(["USDT", "USDC"]);

/**
 * Format a monetary amount (in **minor units**) with its currency symbol.
 *
 * All API values are in minor units (kobo/cents/micro-USDT). This function
 * converts to major units internally before formatting.
 *
 * @example
 * formatCurrency(5000000, 'NGN')                                  // '₦50,000'
 * formatCurrency(33950, 'NGN')                                    // '₦339.50'
 * formatCurrency(123456, 'USD')                                   // '$1,234.56'
 * formatCurrency(150000000, 'NGN', { compact: true })             // '₦1.5M'
 * formatCurrency(5728032, 'USDT')                                 // '5.728032 USDT'
 * formatCurrency(null, 'USD')                                     // '-'
 */
export function formatCurrency(
  amountInMinorUnits: number | null | undefined,
  currency: string = "NGN",
  options: FormatCurrencyOptions = {},
): string {
  if (amountInMinorUnits == null || isNaN(amountInMinorUnits)) return "-";

  const majorAmount = fromMinorUnit(amountInMinorUnits, currency);

  // Always the exact minor units: whole amounts stay whole (₦340), anything
  // with kobo shows all of it (₦339.50, never ₦340 or ₦339.5). A transfer
  // must match the figure to the kobo, so no caller can round money away.
  // Only compact KPI figures abbreviate, to at most one decimal (₦1.5M).
  const decimals = getCurrencyDecimals(currency);
  const { locale = "en-US", compact = false } = options;
  const maximumFractionDigits = compact ? Math.min(1, decimals) : decimals;
  const hasFraction = !Number.isInteger(amountInMinorUnits / 10 ** decimals);
  const minimumFractionDigits =
    hasFraction && !compact ? Math.min(2, decimals) : 0;

  const asPlainNumber = () => {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      ...(compact && { notation: "compact" as const, compactDisplay: "short" as const }),
    }).format(majorAmount);
    return `${formatted} ${currency}`;
  };

  if (NON_ISO_CURRENCIES.has(currency)) return asPlainNumber();

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      // "narrowSymbol" renders ₦ for NGN; the default ("symbol") falls back to
      // the bare code for currencies the locale considers foreign.
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits,
      maximumFractionDigits,
      ...(compact && { notation: "compact" as const, compactDisplay: "short" as const }),
    }).format(majorAmount);
  } catch {
    // A code missing from NON_ISO_CURRENCIES makes Intl throw a RangeError.
    // That used to escape the table cell and take the whole page down with an
    // error boundary (the Ledger page died on USDC). Degrade to a plain number
    // instead: one odd-looking cell beats an unusable screen.
    return asPlainNumber();
  }
}

/** Convert minor units from API to major units for display. */
export function fromMinorUnit(amount: number, currency: string = "NGN"): number {
  return amount / 10 ** getCurrencyDecimals(currency);
}

/** Convert user input (major units) to minor units for API submission. */
export function toMinorUnit(amount: number, currency: string = "NGN"): number {
  return Math.round(amount * 10 ** getCurrencyDecimals(currency));
}
