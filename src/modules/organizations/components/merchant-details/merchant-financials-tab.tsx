import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  AlertCircleIcon,
  CreditCardIcon,
  DollarSignIcon,
  LockIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { MerchantInvoicesTable } from "./merchant-invoices-table";
import { MerchantLedgerTable } from "./merchant-ledger-table";

interface MerchantFinancialsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

export function MerchantFinancialsTab({
  organization,
}: MerchantFinancialsTabProps) {
  const bankAccounts = organization.bankAccounts || [];

  // TODO: Connect to API when stats endpoint is available (e.g. /api/v1/vendors/{id}/stats)
  const stats = [
    {
      label: "Wallet Balance",
      value: "$12,450.00",
      icon: WalletIcon,
      description: "Available for withdrawal",
    },
    {
      label: "Escrow Balance",
      value: "$45,230.00",
      icon: LockIcon,
      description: "Locked in active trades",
    },
    {
      label: "Funds on Hold",
      value: "$2,100.00",
      icon: AlertCircleIcon,
      description: "Disputed transactions",
      variant: "destructive",
    },
    {
      label: "Total Volume (GMV)",
      value: "$1.2M",
      icon: TrendingUpIcon,
      description: "Lifetime value",
    },
    {
      label: "Net Revenue",
      value: "$18,400.00",
      icon: DollarSignIcon,
      description: "Fees collected",
    },
  ];

  // API Integration for Ledger
  const { data: paymentsData, isLoading: isLedgerLoading } =
    api.vendors.payments.list.useQuery({
      path: { id: organization._id },
    });

  // Safe fallback to placeholder or empty array if API fails or organization is not a vendor
  // The 'organization' object might be an Organization document which shares ID with Vendor,
  // or we need to resolve the Vendor ID. Assuming shared ID for now.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ledger =
    (paymentsData as any)?.payments?.map((p: any) => ({
      id: p._id,
      date: new Date(p.createdAt).toLocaleDateString(),
      type: p.description || "Payment",
      amount: `$${p.amount}`,
      status: p.status,
    })) || [];

  // TODO: Connect to API when invoices endpoint supports merchant filtering (e.g. /api/v1/invoices?merchantId={id})
  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-03-01",
      amount: "$450.00",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      date: "2024-02-01",
      amount: "$320.00",
      status: "Paid",
    },
  ];

  return (
    <div className="@container space-y-6">
      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @lg:grid-cols-3 @4xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="max-h-5 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CreditCardIcon className="h-4 w-4" /> Bank Accounts
            </h4>
            {bankAccounts.length > 0 ? (
              <div className="space-y-3">
                {bankAccounts.map((account: any, index: number) => (
                  <div key={index} className="rounded-lg border p-3 text-sm">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{account.bankName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {account.currency}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {account.accountName}
                    </p>
                    <p className="mt-1 font-mono text-xs">
                      {account.accountNumber}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No bank accounts linked.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <MerchantLedgerTable data={ledger} isLoading={isLedgerLoading} />
      <MerchantInvoicesTable data={invoices} />
    </div>
  );
}
