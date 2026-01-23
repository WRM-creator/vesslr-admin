import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  RefreshCcw,
  XCircle,
  Zap,
} from "lucide-react";

type TrendDirection = "up" | "down" | "stable";
type HealthStatus = "healthy" | "warning" | "critical";

interface HealthIndicator {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  status: HealthStatus;
  icon: React.ReactNode;
}

const healthIndicators: HealthIndicator[] = [
  {
    id: "active-transactions",
    label: "Active Transactions",
    value: 47,
    trend: { direction: "up", value: "+12%" },
    status: "healthy",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "completed-today",
    label: "Completed Today",
    value: 128,
    trend: { direction: "up", value: "+8%" },
    status: "healthy",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    id: "failed-operations",
    label: "Failed Operations",
    value: 3,
    trend: { direction: "down", value: "-25%" },
    status: "warning",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    id: "retry-rate",
    label: "Retry Rate",
    value: "2.1%",
    trend: { direction: "stable", value: "0%" },
    status: "healthy",
    icon: <RefreshCcw className="h-4 w-4" />,
  },
];

interface SystemStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
}

const systemStatuses: SystemStatus[] = [
  { id: "payments", name: "Payments", status: "operational" },
  { id: "logistics", name: "Logistics", status: "operational" },
  { id: "compliance", name: "Compliance", status: "operational" },
  { id: "notifications", name: "Notifications", status: "operational" },
];

function getTrendIcon(direction: TrendDirection) {
  switch (direction) {
    case "up":
      return <ArrowUp className="h-3 w-3" />;
    case "down":
      return <ArrowDown className="h-3 w-3" />;
    default:
      return <ArrowRight className="h-3 w-3" />;
  }
}

function getTrendColor(direction: TrendDirection, isGoodUp: boolean = true) {
  if (direction === "stable") return "text-muted-foreground";
  if (direction === "up") {
    return isGoodUp ? "text-green-600" : "text-destructive";
  }
  return isGoodUp ? "text-destructive" : "text-green-600";
}

function getStatusColor(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "text-green-600";
    case "warning":
      return "text-orange-500";
    case "critical":
      return "text-destructive";
  }
}

function getSystemStatusBadge(status: SystemStatus["status"]) {
  switch (status) {
    case "operational":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        >
          Operational
        </Badge>
      );
    case "degraded":
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        >
          Degraded
        </Badge>
      );
    case "down":
      return <Badge variant="destructive">Down</Badge>;
  }
}

export function OperationalHealthSnapshot() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-primary h-5 w-5" />
          Operational Health
        </CardTitle>
        <CardDescription>
          Platform performance and system status overview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {healthIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="bg-card rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className={cn("", getStatusColor(indicator.status))}>
                  {indicator.icon}
                </span>
                {indicator.trend && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      getTrendColor(
                        indicator.trend.direction,
                        indicator.id !== "failed-operations",
                      ),
                    )}
                  >
                    {getTrendIcon(indicator.trend.direction)}
                    {indicator.trend.value}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">
                  {indicator.value}
                  {indicator.unit && (
                    <span className="text-muted-foreground text-sm font-normal">
                      {" "}
                      {indicator.unit}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-xs">
                  {indicator.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div>
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
            System Integrations
          </h4>
          <div className="flex flex-wrap gap-3">
            {systemStatuses.map((system) => (
              <div
                key={system.id}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5"
              >
                <span className="text-sm font-medium">{system.name}</span>
                {getSystemStatusBadge(system.status)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
