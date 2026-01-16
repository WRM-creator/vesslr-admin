
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { StatsCard } from "./stats-card";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value="$45,231.89"
        trend={{ value: 20.1, isPositive: true }}
        description="from last month"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Orders"
        value="+2350"
        trend={{ value: 180.1, isPositive: true }}
        description="orders in progress"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Product Sales"
        value="+12,234"
        trend={{ value: 19, isPositive: true }}
        description="units sold"
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Now"
        value="+573"
        trend={{ value: 201, isPositive: true }}
        description="since last hour"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
