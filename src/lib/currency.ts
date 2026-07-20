interface FormatCurrencyOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

/**
 * Decimal places (scale = 10^decimals) per supported currency — mirrors the
 * backend registry in api/src/common/utils/currency.ts. Fiat uses 2; crypto
 * uses more (USDT = 6). Anything not listed falls back to 2.
 */
const CURRENCY_DECIMALS: Record<string, number> = {
  NGN: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  USDT: 6,
};

const DEFAULT_DECIMALS = 2;

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency] ?? DEFAULT_DECIMALS;
}

/**
 * Currencies Intl.NumberFormat cannot render (non-ISO-4217 codes like USDT
 * throw a RangeError). These format as a plain number with the code suffixed.
 */
const NON_ISO_CURRENCIES = new Set(["USDT"]);

/**
 * Format a monetary amount (in **minor units**) with its currency symbol.
 *
 * All API values are in minor units (kobo/cents/micro-USDT). This function
 * converts to major units internally before formatting.
 *
 * @example
 * formatCurrency(5000000, 'NGN')                                  // '₦50,000'
 * formatCurrency(123456, 'USD', { maximumFractionDigits: 2 })     // '$1,234.56'
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

  const {
    locale = "en-US",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options;

  if (NON_ISO_CURRENCIES.has(currency)) {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      // Show the full crypto precision unless the caller narrowed it.
      maximumFractionDigits:
        options.maximumFractionDigits ?? getCurrencyDecimals(currency),
      ...(compact && { notation: "compact" as const, compactDisplay: "short" as const }),
    }).format(majorAmount);
    return `${formatted} ${currency}`;
  }

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
}

/** Convert minor units from API to major units for display. */
export function fromMinorUnit(amount: number, currency: string = "NGN"): number {
  return amount / 10 ** getCurrencyDecimals(currency);
}

/** Convert user input (major units) to minor units for API submission. */
export function toMinorUnit(amount: number, currency: string = "NGN"): number {
  return Math.round(amount * 10 ** getCurrencyDecimals(currency));
}
