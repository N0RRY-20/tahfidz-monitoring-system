"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartData {
  month: string;
  ayat: number;
}

const chartConfig = {
  ayat: {
    label: "Total Ayat",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProgressChart({ data }: { data: ChartData[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="fill-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="fill-muted-foreground"
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          type="monotone"
          dataKey="ayat"
          stroke="var(--color-ayat)"
          strokeWidth={3}
          dot={{ fill: "var(--color-ayat)", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "var(--color-ayat)" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
