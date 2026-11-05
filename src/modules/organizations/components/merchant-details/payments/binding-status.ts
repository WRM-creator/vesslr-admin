import type { AdminProviderBindingDto } from "@/lib/api/generated";

/**
 * `walletStatus` is the provider wallet's own state; "retired" means the
 * provider was switched off for this org and the wallet is hidden from it.
 * Read defensively: older API builds do not send it.
 */
export function isRetired(binding: AdminProviderBindingDto): boolean {
  return (
    (binding as { walletStatus?: string }).walletStatus === "retired"
  );
}
