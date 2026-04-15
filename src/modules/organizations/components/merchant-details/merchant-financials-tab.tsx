import { api } from "@/lib/api";
import type { AccountBalanceResponseDto } from "@/lib/api/generated";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TINT } from "@/lib/tint";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import {
  CheckCircleIcon,
  CreditCardIcon,
  LockIcon,
  ReceiptTextIcon,
  WalletIcon,
} from "lucide-react";
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
  const bankDetails = organization.bankDetails;

  const wallet = useAccountBalance(orgId, "WALLET");
  const escrow = useAccountBalance(orgId, "PAYABLE");
  const receivable = useAccountBalance(orgId, "RECEIVABLE");

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

  const balanceLoading = wallet.isLoading || escrow.isLoading || receivable.isLoading;
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
                  <p className="text-xs text-white/50">Escrow Locked</p>
                  {balanceLoading ? (
                    <Skeleton className="h-7 w-28 bg-white/10" />
                  ) : (
                    <p className="text-lg font-semibold">
                      {formatCurrency(escrow.balance, currency, {
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
                  <p className="text-xs text-white/50">Receivables</p>
                  {balanceLoading ? (
                    <Skeleton className="h-7 w-28 bg-white/10" />
                  ) : (
                    <p className="text-lg font-semibold">
                      {formatCurrency(receivable.balance, currency, {
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

      {/* Payout Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Payout Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bankDetails ? (
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {bankDetails.bankName}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {bankDetails.currency}
                      </Badge>
                      {bankDetails.verifiedAt ? (
                        <Badge
                          variant="outline"
                          className={`gap-1 text-[10px] ${TINT.green}`}
                        >
                          <CheckCircleIcon className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-yellow-700 dark:text-yellow-400"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {bankDetails.accountName}
                    </p>
                    <p className="mt-0.5 font-mono text-sm">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No bank account linked.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ledger History */}
      <MerchantLedgerTable data={ledgerEntries} isLoading={statementLoading} />
    </div>
  );
}
