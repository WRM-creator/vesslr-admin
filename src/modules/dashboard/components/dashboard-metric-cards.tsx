import { MetricCard } from "@/components/shared/metric-card";
import { api } from "@/lib/api";
import type { DashboardStatsDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import {
  Activity,
  CheckCircle2,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminDashboardSparklines } from "../hooks/use-admin-dashboard-sparklines";

export function DashboardMetricCards() {
  const { data, isLoading: statsLoading } =
    api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;
  const sparks = useAdminDashboardSparklines();
  const navigate = useNavigate();

  const currency = stats?.currency ?? "NGN";
  const isLoading = statsLoading || sparks.feeRevenue.isLoading;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-base font-medium">
        Platform Metrics
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Fee Revenue (30d)"
          value={
            stats
              ? formatCurrency(stats.feeRevenue30d, currency, { compact: true })
              : null
          }
          icon={TrendingUp}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          delta={sparks.feeRevenue.delta}
          series={sparks.feeRevenue.series}
          chartKey="feeRevenue"
          chartColor="#8b5cf6"
          isLoading={isLoading}
          onClick={() => navigate("/ledger")}
        />

        <MetricCard
          title="Organizations"
          value={stats?.totalOrganizations?.toLocaleString() ?? null}
          icon={Building2}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          delta={sparks.newOrganizations.delta}
          series={sparks.newOrganizations.series}
          chartKey="orgs"
          chartColor="#3b82f6"
          isLoading={isLoading}
          onClick={() => navigate("/organizations")}
        />

        <MetricCard
          title="Active Transactions"
          value={stats?.activeTransactions?.toLocaleString() ?? null}
          icon={Activity}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          delta={sparks.activeTransactions.delta}
          series={sparks.activeTransactions.series}
          chartKey="activeTx"
          chartColor="#10b981"
          isLoading={isLoading}
          onClick={() => navigate("/transactions")}
        />

        <MetricCard
          title="Completed"
          value={stats?.completedTransactions?.toLocaleString() ?? null}
          icon={CheckCircle2}
          iconClassName="bg-primary/10 text-primary"
          delta={sparks.completedTransactions.delta}
          series={sparks.completedTransactions.series}
          chartKey="completed"
          chartColor="var(--primary)"
          isLoading={isLoading}
          onClick={() => navigate("/transactions?status=closed")}
        />
      </div>
    </div>
  );
}
