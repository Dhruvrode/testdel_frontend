"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";
import { RegionRevenue } from "@/app/types/dashboard";
import { getRegionRevenue } from "@/lib/api/dashboard";

export default function RegionChart() {
  const [data, setData] = useState<RegionRevenue[]>([]);

 useEffect(() => {
  async function load() {
    const res = await getRegionRevenue();
    setData(res);
  }
  load();
}, []);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ${c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: {
        color: "#94a3b8",
        fontSize: 12,
      },
      itemGap: 12,
    },
    series: [
      {
        name: "Revenue",
        type: "pie",
        radius: ["45%", "70%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#020617",
          borderWidth: 2,
        },
        label: { show: false },
        data: data.map((r) => ({
          name: r.region,
          value: r.revenue,
        })),
      },
    ],
    color: ["#6366f1", "#22c55e", "#f59e0b", "#0ea5e9"],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <EditableLabel labelKey="revenue_region" />
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <ReactECharts option={option} style={{ height: 280 }} />
      </CardContent>
    </Card>
  );
}
