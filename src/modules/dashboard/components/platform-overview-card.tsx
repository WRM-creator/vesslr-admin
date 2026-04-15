import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { DashboardStatsDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { LockIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

const RECON_DOT: Record<string, string> = {
  CLEAN: "bg-emerald-400",
  DISCREPANCIES_BACKFILLED: "bg-amber-400",
  DISCREPANCIES_FOUND: "bg-red-400",
};

const RECON_LABEL: Record<string, string> = {
  CLEAN: "Clean",
  DISCREPANCIES_BACKFILLED: "Backfilled",
  DISCREPANCIES_FOUND: "Discrepancies",
};

function formatRelativeTime(date: string | null): string {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PlatformOverviewCard() {
  const { data, isLoading } = api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;
  const currency = stats?.currency ?? "NGN";

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-950 via-zinc-900 to-slate-900 px-6 py-8 shadow-lg shadow-black/20">
      {/* Decorative blobs */}
      <div className="bg-primary/20 pointer-events-none absolute -top-20 right-10 h-60 w-60 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="@container relative flex flex-col gap-6 @2xl:flex-row @2xl:items-end @2xl:justify-between">
        {/* Hero: Platform Operating Balance */}
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/60">
            <WalletIcon className="min-size-4" />
            Platform Balance
          </div>
          {isLoading ? (
            <Skeleton className="h-12 w-48 bg-white/10" />
          ) : (
            <div className="text-4xl font-bold tracking-tight text-white tabular-nums">
              {formatCurrency(stats?.platformOperatingBalance ?? 0, currency, {
                compact: true,
              })}
            </div>
          )}
          <p className="mt-1 text-xs text-white/40">operating funds</p>
        </div>

        {/* Secondary stats */}
        <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-4 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-6">
          {/* Escrow Liability */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <LockIcon className="min-size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/50">Escrow Liability</p>
              {isLoading ? (
                <Skeleton className="h-7 w-28 bg-white/10" />
              ) : (
                <p className="text-lg font-semibold text-white tabular-nums">
                  {formatCurrency(stats?.escrowLiability ?? 0, currency, {
                    compact: true,
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Volume (30d) */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <TrendingUpIcon className="min-size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/50">Volume (30d)</p>
              {isLoading ? (
                <Skeleton className="h-7 w-28 bg-white/10" />
              ) : (
                <p className="text-lg font-semibold text-white tabular-nums">
                  {formatCurrency(stats?.transactionVolume30d ?? 0, currency, {
                    compact: true,
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Reconciliation indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                stats?.lastReconStatus
                  ? (RECON_DOT[stats.lastReconStatus] ?? "bg-gray-400")
                  : "bg-gray-500"
              }`}
            />
            <div>
              <p className="text-xs text-white/50">Reconciliation</p>
              {isLoading ? (
                <Skeleton className="h-4 w-20 bg-white/10" />
              ) : (
                <p className="text-sm font-medium text-white">
                  {stats?.lastReconStatus
                    ? RECON_LABEL[stats.lastReconStatus]
                    : "No data"}
                  {stats?.lastReconAt && (
                    <span className="ml-1 text-xs font-normal text-white/40">
                      · {formatRelativeTime(stats.lastReconAt as string)}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
