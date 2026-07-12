import type { DrainItemDto, ProviderDrainDto } from "@/lib/api/generated";
import { TINT } from "@/lib/tint";

/** "busha" -> "Busha". Provider names are admin-facing here, which is fine. */
export function formatProvider(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const DRAIN_STATUS: Record<
  ProviderDrainDto["status"],
  { label: string; tint: string }
> = {
  draft: { label: "Draft", tint: TINT.gray },
  frozen: { label: "Frozen", tint: TINT.sky },
  scanning: { label: "Scanning", tint: TINT.indigo },
  checked: { label: "Checked", tint: TINT.blue },
  sweeping: { label: "Sweeping", tint: TINT.amber },
  paused: { label: "Paused", tint: TINT.yellow },
  completed: { label: "Completed", tint: TINT.green },
};

export const ITEM_STATUS: Record<
  DrainItemDto["status"],
  { label: string; tint: string }
> = {
  blocked: { label: "Blocked", tint: TINT.orange },
  pending: { label: "Pending", tint: TINT.gray },
  transferring: { label: "Transferring", tint: TINT.indigo },
  compensating: { label: "Reimbursing", tint: TINT.violet },
  done: { label: "Done", tint: TINT.green },
  failed: { label: "Failed", tint: TINT.red },
  stuck: { label: "Stuck", tint: TINT.rose },
};

export const GAP_REASON: Record<
  NonNullable<DrainItemDto["gapReason"]>,
  string
> = {
  source_inactive: "Source wallet binding is not active",
  no_payout_rail: "The provider cannot send this currency out",
  no_target_wallet: "No surviving wallet can receive this currency",
  balance_unavailable: "The custodian balance could not be read",
};

export function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}
