import type {
  AdminProvidusSettlementDto,
  ProvidusReconciliationDto,
} from "@/lib/api/generated";
import { formatCurrency, toMinorUnit } from "@/lib/currency";
import { TINT } from "@/lib/tint";

export type ReconciliationResult = ProvidusReconciliationDto["result"];
export type ResultFilter = ReconciliationResult | "unchecked";

export const RESULT: Record<
  ResultFilter,
  { label: string; tint: string; description: string }
> = {
  agreed: {
    label: "Agreed",
    tint: TINT.green,
    description:
      "Providus agrees on amount and account, and shows it posted and acknowledged.",
  },
  pending: {
    label: "Pending",
    tint: TINT.amber,
    description:
      "Fields match, but Providus has not posted it or seen our acknowledgement yet.",
  },
  disagreed: {
    label: "Disagreed",
    tint: TINT.red,
    description: "Providus's lookup differs from what the webhook told us.",
  },
  not_found: {
    label: "Not found",
    tint: TINT.rose,
    description: "Providus knows neither the settlement ID nor the session ID.",
  },
  error: {
    label: "Lookup failed",
    tint: TINT.orange,
    description: "Providus has not answered a lookup for this settlement yet.",
  },
  unchecked: {
    label: "Not checked",
    tint: TINT.gray,
    description: "Never looked up at Providus.",
  },
};

export const RESULT_ORDER: ResultFilter[] = [
  "disagreed",
  "not_found",
  "error",
  "pending",
  "agreed",
  "unchecked",
];

export const STATUS: Record<
  AdminProvidusSettlementDto["status"],
  { label: string; tint: string }
> = {
  recorded: { label: "Recorded", tint: TINT.sky },
  processed: { label: "Processed", tint: TINT.green },
  rejected: { label: "Rejected", tint: TINT.red },
};

/** Providus amounts are naira with kobo. */
export function formatNaira(amount: number | undefined, currency = "NGN") {
  if (amount == null) return "-";
  return formatCurrency(toMinorUnit(amount, currency), currency, {
    maximumFractionDigits: 2,
  });
}

/** Readable names for the fields `mismatches` lists. */
export const FIELD_LABEL: Record<string, string> = {
  settlementId: "Settlement ID",
  sessionId: "Session ID",
  accountNumber: "Account",
  settledAmount: "Settled amount",
  transactionAmount: "Transaction amount",
  currency: "Currency",
  reversal: "Reversed at Providus",
};

export function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}
