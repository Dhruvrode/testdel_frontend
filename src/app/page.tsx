"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, CreditCard, TrendingUp } from "lucide-react";
import RevenueChart from "@/components/charts/RevenueChart";
import Counters from "@/components/counters/Counters";
import RegionChart from "@/components/charts/RegionChart";
import { SalesTable } from "@/components/tables/SalesTable";
import { getDashboardSummary } from "@/lib/api/dashboard";
import EditableLabel from "./labels/EditableLabel";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    revenue: 0,
    orders: 0,
    avgOrder: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const sum = await getDashboardSummary();
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load summary:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
     } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading dashboard..." className="h-screen" />;
  }

  // if (error) {
  //   return <ErrorState error={error} onRetry={loadData} className="h-screen" />;
  // }

  return (
    <div className="space-y-6">
      <EditableLabel labelKey="page_dashboard_title" />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Counters
          labelKey="revenue_card"
          value={`$${summary.revenue.toLocaleString()}`}
          subtitle={`${summary.growth > 0 ? "+" : ""}${summary.growth.toFixed(1)}% from last month`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="orders_card"
          value={summary.orders.toLocaleString()}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="avg_order_card"
          value={`$${summary.avgOrder.toFixed(2)}`}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="growth_card"
          value={`${summary.growth > 0 ? "+" : ""}${summary.growth.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <RegionChart />
      </div>

      {/* Table */}
      <SalesTable />
    </div>
  );
}
