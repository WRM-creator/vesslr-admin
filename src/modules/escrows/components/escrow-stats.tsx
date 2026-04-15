import { formatCurrency } from "@/lib/currency";
import { StatsCard } from "@/components/shared/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle, DollarSign, Lock } from "lucide-react";

export function EscrowStats() {
  const { data, isLoading } = api.admin.escrows.stats.useQuery({});

  const stats = data as unknown as {
    totalHeld: number;
    totalReleased: number;
    activeCount: number;
    disputedCount: number;
  } | undefined;

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Value Locked"
        value={isLoading ? "—" : formatCurrency(stats?.totalHeld ?? 0)}
        description="Currently held in escrow"
        icon={<Lock className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Total Released"
        value={isLoading ? "—" : formatCurrency(stats?.totalReleased ?? 0)}
        description="Lifetime volume released"
        icon={<DollarSign className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Active Escrows"
        value={isLoading ? "—" : (stats?.activeCount ?? 0)}
        description="In progress"
        icon={<CheckCircle className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Active Disputes"
        value={isLoading ? "—" : (stats?.disputedCount ?? 0)}
        description="Require attention"
        icon={<AlertCircle className="text-muted-foreground h-4 w-4" />}
      />
    </div>
  );
}
