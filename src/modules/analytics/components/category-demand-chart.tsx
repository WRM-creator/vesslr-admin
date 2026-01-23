"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { MOCK_CATEGORY_DEMAND } from "../lib/analytics-model";

const chartConfig = {
  itemCount: {
    label: "Active Requests",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CategoryDemandChart() {
  // Sort by item count desc
  const data = [...MOCK_CATEGORY_DEMAND].sort(
    (a, b) => b.itemCount - a.itemCount,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Demand</CardTitle>
        <CardDescription>
          Top categories by active request volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 20, // increased for longer category names
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={140}
              tickFormatter={(value) => value} // Show full name if possible or truncate
              style={{ fontSize: "12px" }}
            />
            <XAxis dataKey="itemCount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="itemCount"
              layout="vertical"
              fill="var(--color-itemCount)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
