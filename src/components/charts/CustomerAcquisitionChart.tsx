// components/charts/CustomerAcquisitionChart.tsx
"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";

interface AcquisitionData {
  month: string;
  customers: number;
}

export default function CustomerAcquisitionChart() {
  const [data, setData] = useState<AcquisitionData[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/customers/acquisition");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c} new customers",
    },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: "category",
      data: data.map((d) => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94a3b8" },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#1f2933" } },
      axisLabel: { color: "#94a3b8" },
    },
    series: [
      {
        name: "New Customers",
        type: "line",
        smooth: true,
        data: data.map((d) => d.customers),
        lineStyle: { width: 3, color: "#22c55e" },
        itemStyle: { color: "#22c55e" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(34,197,94,0.3)" },
              { offset: 1, color: "rgba(34,197,94,0.05)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <EditableLabel labelKey="customer_acquisition" />
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ReactECharts option={option} style={{ height: 280 }} />
      </CardContent>
    </Card>
  );
}