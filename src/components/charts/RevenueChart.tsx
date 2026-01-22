"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditableLabel from "../../app/labels/EditableLabel";
import { RevenuePoint } from "@/app/types/dashboard";
import { getRevenueData } from "@/lib/api/dashboard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RevenueChart() {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRevenueData();
      setData(res);
    } catch (err) {
      console.error("Failed to load revenue data:", err);
      setError(err instanceof Error ? err.message : "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: "category",
      data: data.map((d) => d.label),
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
        name: "Revenue",
        type: "line",
        smooth: true,
        symbolSize: 6,
        data: data.map((d) => d.value),
        lineStyle: { width: 3, color: "#6366f1" },
        itemStyle: { color: "#6366f1" },
        areaStyle: { color: "rgba(99,102,241,0.15)" },
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
        {loading && <LoadingState message="Loading revenue data..." />}
        {error && <ErrorState error={error} onRetry={loadData} />}
        {!loading && !error && (
          <ReactECharts option={option} style={{ height: 280 }} />
        )}
      </CardContent>
    </Card>
  );
}