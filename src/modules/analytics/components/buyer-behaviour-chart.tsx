"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";

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
import { generateBuyerBehaviourData } from "../lib/analytics-model";

const chartConfig = {
  newBuyers: {
    label: "New Buyers",
    color: "hsl(var(--chart-1))",
  },
  repeatBuyers: {
    label: "Repeat Buyers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const data = generateBuyerBehaviourData(12);

export function BuyerBehaviourChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyer Behaviour</CardTitle>
        <CardDescription>New vs. Returning Buyers (Weekly)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.replace("Week ", "W")}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="newBuyers"
              stackId="a"
              fill="var(--color-newBuyers)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="repeatBuyers"
              stackId="a"
              fill="var(--color-repeatBuyers)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
