"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", transactions: 222 },
  { date: "2024-04-02", transactions: 97 },
  { date: "2024-04-03", transactions: 167 },
  { date: "2024-04-04", transactions: 242 },
  { date: "2024-04-05", transactions: 373 },
  { date: "2024-04-06", transactions: 301 },
  { date: "2024-04-07", transactions: 245 },
  { date: "2024-04-08", transactions: 409 },
  { date: "2024-04-09", transactions: 59 },
  { date: "2024-04-10", transactions: 261 },
  { date: "2024-04-11", transactions: 327 },
  { date: "2024-04-12", transactions: 292 },
  { date: "2024-04-13", transactions: 342 },
  { date: "2024-04-14", transactions: 137 },
  { date: "2024-04-15", transactions: 120 },
  { date: "2024-04-16", transactions: 138 },
  { date: "2024-04-17", transactions: 446 },
  { date: "2024-04-18", transactions: 364 },
  { date: "2024-04-19", transactions: 243 },
  { date: "2024-04-20", transactions: 89 },
  { date: "2024-04-21", transactions: 137 },
  { date: "2024-04-22", transactions: 224 },
  { date: "2024-04-23", transactions: 138 },
  { date: "2024-04-24", transactions: 387 },
  { date: "2024-04-25", transactions: 215 },
  { date: "2024-04-26", transactions: 75 },
  { date: "2024-04-27", transactions: 383 },
  { date: "2024-04-28", transactions: 122 },
  { date: "2024-04-29", transactions: 315 },
  { date: "2024-04-30", transactions: 454 },
];

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function TransactionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>
          Daily transaction volume for the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="transactions"
              type="natural"
              fill="var(--color-transactions)"
              fillOpacity={0.4}
              stroke="var(--color-transactions)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
