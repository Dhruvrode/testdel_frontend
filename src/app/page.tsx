// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, CreditCard, TrendingUp } from "lucide-react";
import RevenueChart from "@/components/charts/RevenueChart";
 import Counters from "@/components/counters/Counters";
import RegionChart from "@/components/charts/RegionChart";
import { SalesTable } from "@/components/tables/SalesTable";
import { getDashboardSummary } from "@/lib/api/dashboard";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    revenue: 0,
    orders: 0,
    avgOrder: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        console.log("🔄 Loading dashboard summary...");
        
        const sum = await getDashboardSummary();
        
        console.log("✅ Summary received:", sum);
        setSummary(sum);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to load summary:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center max-w-md">
  //         <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
  //         <p className="text-muted-foreground mb-4">{error}</p>
  //         <div className="space-y-2 text-sm text-left bg-muted p-4 rounded">
  //           <p>Troubleshooting:</p>
  //           <ul className="list-disc list-inside space-y-1">
  //             <li>Is your backend running on port 4000?</li>
  //             <li>Check: <code>http://localhost:4000/dashboard/summary</code></li>
  //             <li>Is BACKEND_URL set in .env.local?</li>
  //             <li>Check browser console (F12) for more details</li>
  //           </ul>
  //         </div>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

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