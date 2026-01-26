import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { StatsCard } from "@/modules/dashboard/components/stats-card";
import { AlertCircle, CheckCircle, DollarSign, Lock } from "lucide-react";

export function EscrowStats() {
  const { data: statsData, isLoading } = api.admin.escrows.stats.useQuery({});

  if (isLoading) {
    return (
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = (statsData as any)?.data || {
    totalHeld: 0,
    totalTransacted: 0,
    activeCount: 0,
    disputedCount: 0,
    completedCount: 0,
  };

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Value Locked"
        value={formatCurrency(stats.totalHeld)}
        description="Currently held in escrow"
        icon={<Lock className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Total Transacted"
        value={formatCurrency(stats.totalTransacted)}
        description="Lifetime volume released"
        icon={<DollarSign className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Active Escrows"
        value={stats.activeCount}
        description="In progress"
        icon={<CheckCircle className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Active Disputes"
        value={stats.disputedCount}
        description="Require attention"
        icon={<AlertCircle className="text-muted-foreground h-4 w-4" />}
      />
    </div>
  );
}
