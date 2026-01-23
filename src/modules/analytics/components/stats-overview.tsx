import { StatsCard } from "@/modules/dashboard/components/stats-card";
import {
  Activity,
  AlertTriangle,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Transaction Volume"
        value="$4,231,890"
        trend={{ value: 12.5, isPositive: true }}
        icon={<DollarSign className="h-4 w-4" />}
        description="vs. last month"
      />
      <StatsCard
        title="Active Merchants"
        value="573"
        trend={{ value: 4.1, isPositive: true }}
        icon={<Users className="h-4 w-4" />}
        description="Total verified sellers"
      />
      <StatsCard
        title="Active Buyers"
        value="2,412"
        trend={{ value: 8.2, isPositive: true }}
        icon={<Users className="h-4 w-4" />}
        description="Active this month"
      />
      <StatsCard
        title="Fraud Alerts"
        value="12"
        trend={{ value: 2.4, isPositive: false }} // Negative trend means LESS fraud (good!) but for this component false usually means red.
        // Actually StatsCard logic: isPositive controls color (green vs red).
        // For fraud, "increase" (bad) should be red. "decrease" (good) should be green.
        // Let's assume +2.4% fraud is BAD, so isPositive: false (Red)
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Requires attention"
      />
      <StatsCard
        title="Avg. Order Value"
        value="$8,250"
        trend={{ value: 1.2, isPositive: true }}
        icon={<CreditCard className="h-4 w-4" />}
        description="vs. last month"
      />
      <StatsCard
        title="Platform Health"
        value="99.9%"
        icon={<Activity className="h-4 w-4" />}
        description="All systems operational"
      />
    </div>
  );
}
