import { api } from "@/lib/api";
import type { AccountBalanceResponseDto } from "@/lib/api/generated";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { LockIcon, ReceiptTextIcon, WalletIcon } from "lucide-react";
import { useMemo } from "react";
import { MerchantLedgerTable } from "./merchant-ledger-table";
import {
  toLedgerEntry,
  type JournalEntryResponse,
} from "./merchant-ledger-table/types";

interface MerchantFinancialsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

function useAccountBalance(orgId: string, suffix: string) {
  const code = `ORG:${orgId}:${suffix}`;
  const { data, isLoading } = api.admin.ledger.account.useQuery(
    { path: { code } },
    { enabled: !!orgId, retry: false },
  );
  const account = data as AccountBalanceResponseDto | undefined;
  return {
    balance: account?.balance ?? 0,
    currency: account?.currency ?? "NGN",
    isLoading,
  };
}

export function MerchantFinancialsTab({
  organization,
}: MerchantFinancialsTabProps) {
  const orgId = organization._id as string;

  // Ledger semantics (ledger-accounts.ts): PAYABLE = in-flight inbound from
  // the org; RECEIVABLE = in-flight outbound to the org's bank. Neither is
  // escrow — escrowed funds live on the platform escrow liability account.
  const wallet = useAccountBalance(orgId, "WALLET");
  const inbound = useAccountBalance(orgId, "PAYABLE");
  const outbound = useAccountBalance(orgId, "RECEIVABLE");

  const walletCode = `ORG:${orgId}:WALLET`;
  const { data: statementData, isLoading: statementLoading } =
    api.admin.ledger.statement.useQuery(
      { path: { code: walletCode }, query: { limit: "50" } },
      { enabled: !!orgId, retry: false },
    );

  const ledgerEntries = useMemo(() => {
    if (!statementData) return [];
    const entries = statementData as unknown as JournalEntryResponse[];
    return entries.map((e) => toLedgerEntry(e, walletCode));
  }, [statementData, walletCode]);

  const balanceLoading = wallet.isLoading || inbound.isLoading || outbound.isLoading;
  const currency = wallet.currency;

  return (
    <div className="@container space-y-6">
      {/* Balance Overview Card */}
      <Card className="border-primary/20 bg-[#040404] text-white">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 @2xl:flex-row @2xl:items-end @2xl:justify-between">
            {/* Wallet Balance — hero stat */}
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/60">
                <WalletIcon className="h-4 w-4" />
                Wallet Balance
              </div>
              {balanceLoading ? (
                <Skeleton className="h-10 w-48 bg-white/10" />
              ) : (
                <div className="text-4xl font-semibold tracking-tight">
                  {formatCurrency(wallet.balance, currency, {
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>

            {/* Secondary stats */}
            <div className="flex items-center gap-6 border-t border-white/10 pt-4 @lg:border-t-0 @lg:border-l @lg:pt-0 @lg:pl-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <LockIcon className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Inbound In-flight</p>
                  {balanceLoading ? (
                    <Skeleton className="h-7 w-28 bg-white/10" />
                  ) : (
                    <p className="text-lg font-semibold">
                      {formatCurrency(inbound.balance, currency, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <ReceiptTextIcon className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Outbound In-flight</p>
                  {balanceLoading ? (
                    <Skeleton className="h-7 w-28 bg-white/10" />
                  ) : (
                    <p className="text-lg font-semibold">
                      {formatCurrency(outbound.balance, currency, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger History */}
      <MerchantLedgerTable data={ledgerEntries} isLoading={statementLoading} />
    </div>
  );
}
