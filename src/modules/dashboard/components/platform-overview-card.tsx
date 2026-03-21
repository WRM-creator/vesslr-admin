import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import type { DashboardStatsDto } from "@/lib/api/generated";
import {
  ArrowLeftRight,
  LockIcon,
  TrendingUpIcon,
} from "lucide-react";

export function PlatformOverviewCard() {
  const { data, isLoading } = api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;

  return (
    <Card className="border-primary/20 bg-[#040404] text-white">
      <CardContent className="p-6">
        <div className="@container flex flex-col gap-6 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          {/* Primary stat */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/60">
              <ArrowLeftRight className="h-4 w-4" />
              Active Transactions
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-20 bg-white/10" />
            ) : (
              <div className="text-4xl font-semibold tracking-tight">
                {stats?.activeTransactions ?? 0}
              </div>
            )}
          </div>

          {/* Secondary stats */}
          <div className="flex items-center gap-6 border-t border-white/10 pt-4 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <LockIcon className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-white/50">Escrow Held</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-28 bg-white/10" />
                ) : (
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      stats?.totalEscrowHeld ?? 0,
                      stats?.currency ?? "NGN",
                      { compact: true },
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <TrendingUpIcon className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-white/50">Volume (30d)</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-28 bg-white/10" />
                ) : (
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      stats?.transactionVolume30d ?? 0,
                      stats?.currency ?? "NGN",
                      { compact: true },
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
