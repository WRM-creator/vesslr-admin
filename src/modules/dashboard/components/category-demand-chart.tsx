"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  { category: "Petroleum", items: 186 },
  { category: "Heavy Machinery", items: 305 },
  { category: "Safety Gear", items: 237 },
  { category: "Tools", items: 73 },
  { category: "Spare Parts", items: 209 },
  { category: "Electronics", items: 214 },
];

const chartConfig = {
  items: {
    label: "Items",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function CategoryDemandChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Demand</CardTitle>
        <CardDescription>
          Number of active product requests by category.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="items" fill="var(--color-items)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
