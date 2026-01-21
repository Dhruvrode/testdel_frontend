// components/charts/CustomerLTVChart.tsx
"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";

interface LTVData {
  tier: string;
  count: number;
}

export default function CustomerLTVChart() {
  const [data, setData] = useState<LTVData[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/customers/ltv-distribution");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} customers ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: { color: "#94a3b8", fontSize: 12 },
      itemGap: 12,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "50%"],
        data: data.map((d) => ({
          name: d.tier,
          value: d.count,
        })),
        itemStyle: {
          borderRadius: 6,
          borderColor: "#020617",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    color: ["#f59e0b", "#22c55e", "#6366f1", "#ec4899"],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <EditableLabel labelKey="customer_ltv" />
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ReactECharts option={option} style={{ height: 280 }} />
      </CardContent>
    </Card>
  );
}