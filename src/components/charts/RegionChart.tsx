"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";
import { RegionRevenue } from "@/app/types/dashboard";
import { getRegionRevenue } from "@/lib/api/dashboard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RegionChart() {
  const [data, setData] = useState<RegionRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRegionRevenue();
      setData(res);
    } catch (err) {
      console.error("Failed to load region revenue:", err);
      setError(err instanceof Error ? err.message : "Failed to load region data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      textStyle: { color: "#94a3b8", fontSize: 12 },
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
        {loading && <LoadingState message="Loading region data..." />}
        {error && <ErrorState error={error} onRetry={loadData} />}
        {!loading && !error && (
          <ReactECharts option={option} style={{ height: 280 }} />
        )}
      </CardContent>
    </Card>
  );
}