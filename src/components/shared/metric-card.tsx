import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { SparkDelta, SparkPoint } from "@/lib/sparklines";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import { Area, AreaChart } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number | null;
  icon: LucideIcon;
  iconClassName?: string;
  delta?: SparkDelta;
  series?: SparkPoint[];
  chartKey?: string;
  chartColor?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const DeltaChip = ({ delta }: { delta: SparkDelta }) => {
  const { direction, value } = delta;
  const Icon =
    direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const color =
    direction === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : direction === "down"
        ? "text-rose-600 dark:text-rose-400"
        : "text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        color,
      )}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconClassName = "bg-primary/10 text-primary",
  delta,
  series,
  chartKey = "value",
  chartColor = "var(--primary)",
  isLoading = false,
  onClick,
}: MetricCardProps) => {
  const hasChart = Array.isArray(series) && series.length > 0;
  const gradientId = `metric-grad-${chartKey}`;

  const chartConfig = {
    [chartKey]: {
      label: title,
      color: chartColor,
    },
  } satisfies ChartConfig;

  return (
    <Card
      className="group hover:border-primary/30 cursor-pointer gap-0 overflow-hidden py-0 shadow-none transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              iconClassName,
            )}
          >
            <Icon className="size-4" />
          </div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {title}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {isLoading || value === null ? (
            <Skeleton className="h-7 w-28" />
          ) : (
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
              {value}
            </div>
          )}
          {delta && !isLoading ? (
            <div className="flex items-center gap-1.5">
              <DeltaChip delta={delta} />
              <span className="text-muted-foreground text-xs">vs last 7d</span>
            </div>
          ) : null}
        </div>
      </CardContent>

      {hasChart ? (
        <div className="px-1 pb-1">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-10 w-full"
          >
            <AreaChart
              data={series}
              margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${chartKey})`}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${chartKey})`}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={`var(--color-${chartKey})`}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      ) : null}
    </Card>
  );
};
