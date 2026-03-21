import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { DashboardStatsDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";

export function PlatformStats() {
  const { data, isLoading } = api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;

  const items = [
    {
      label: "Total Organizations",
      value: stats?.totalOrganizations?.toLocaleString() ?? "0",
      subtitle: `${stats?.totalMerchants ?? 0} merchants · ${stats?.totalCustomers ?? 0} customers`,
    },
    {
      label: "Products Listed",
      value: stats?.totalProducts?.toLocaleString() ?? "0",
      subtitle: `${stats?.approvedProducts ?? 0} approved · ${stats?.pendingProducts ?? 0} pending`,
    },
    {
      label: "Completed Transactions",
      value: stats?.completedTransactions?.toLocaleString() ?? "0",
      subtitle: "all time",
    },
    {
      label: "Total Escrow Value",
      value: formatCurrency(stats?.totalEscrowHeld ?? 0, stats?.currency ?? "NGN", {
        compact: true,
      }),
      subtitle: `across ${stats?.activeTransactions ?? 0} active transactions`,
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-base font-medium">Platform Overview</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((stat) => (
          <Card key={stat.label} className="py-0 shadow-none">
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="mb-1 h-7 w-24" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-4 w-32" />
              ) : (
                <p className="text-muted-foreground mt-1 text-xs">
                  {stat.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
