import { getDisputeStats } from "@/lib/api/disputes";
import { StatsCard } from "@/modules/dashboard/components/stats-card";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Files } from "lucide-react";

export function DisputeStats() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "disputes", "stats"],
    queryFn: getDisputeStats,
  });

  if (!stats) {
    return (
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Disputes"
        value={stats.totalDocs}
        description="All time"
        icon={<Files className="text-muted-foreground h-4 w-4" />}
      />
      <StatsCard
        title="Open Cases"
        value={stats.openDocs}
        description="Require resolution"
        icon={<AlertCircle className="text-destructive h-4 w-4" />}
      />
      <StatsCard
        title="Resolved"
        value={stats.resolvedDocs}
        description="Closed cases"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      />
    </div>
  );
}
