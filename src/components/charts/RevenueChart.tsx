 

"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";
import { RevenuePoint } from "@/app/types/dashboard";
import { getRevenueData } from "@/lib/api/dashboard";

export default function RevenueChart() {
  const [data, setData] = useState<RevenuePoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getRevenueData();
      console.log(res);
      setData(res);
    }
    load();
  }, []);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: "category",
      data: data.map((d) => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#94a3b8",
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: "#1f2933",
        },
      },
      axisLabel: {
        color: "#94a3b8",
      },
    },

    series: [
      {
        name: "Revenue",
        type: "line",
        smooth: true,
        symbolSize: 6,
        data: data.map((d) => d.value),
        lineStyle: {
          width: 3,
          color: "#6366f1",
        },
        itemStyle: {
          color: "#6366f1",
        },
        areaStyle: {
          color: "rgba(99,102,241,0.15)",
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <EditableLabel labelKey="metric_revenue" />
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <ReactECharts option={option} style={{ height: 280 }} />
      </CardContent>
    </Card>
  );
}
