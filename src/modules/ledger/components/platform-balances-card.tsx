import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import {
  LockIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import type { LedgerAccount } from "../types";

interface PlatformBalancesCardProps {
  accounts: LedgerAccount[];
  isLoading?: boolean;
}

export function PlatformBalancesCard({
  accounts,
  isLoading,
}: PlatformBalancesCardProps) {
  const escrow = accounts.find(
    (a) => a.accountCode === "PLATFORM:ESCROW_LIABILITY",
  );
  const revenue = accounts.find(
    (a) => a.accountCode === "PLATFORM:FEE_REVENUE",
  );
  const operating = accounts.find(
    (a) => a.accountCode === "PLATFORM:OPERATING",
  );

  return (
    <Card className="border-primary/20 bg-[#040404] text-white">
      <CardContent className="p-6">
        <div className="@container flex flex-col gap-6 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          {/* Primary stat — Escrow Liability */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/60">
              <LockIcon className="h-4 w-4" />
              Total Escrow Liability
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-40 bg-white/10" />
            ) : (
              <div className="text-4xl font-semibold tracking-tight">
                {formatCurrency(
                  escrow?.balance ?? 0,
                  escrow?.currency ?? "NGN",
                )}
              </div>
            )}
          </div>

          {/* Secondary stats */}
          <div className="flex items-center gap-6 border-t border-white/10 pt-4 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <TrendingUpIcon className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-white/50">Fee Revenue</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-28 bg-white/10" />
                ) : (
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      revenue?.balance ?? 0,
                      revenue?.currency ?? "NGN",
                      { compact: true },
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <WalletIcon className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-white/50">Operating Funds</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-28 bg-white/10" />
                ) : (
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      operating?.balance ?? 0,
                      operating?.currency ?? "NGN",
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
