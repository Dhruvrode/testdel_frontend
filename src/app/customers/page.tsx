"use client";

import { useEffect, useState } from "react";
import CustomerAcquisitionChart from "@/components/charts/CustomerAcquisitionChart";
import CustomerLTVChart from "@/components/charts/CustomerLTVChart";
import Counters from "@/components/counters/Counters";
import EditableLabel from "@/app/labels/EditableLabel";
import CustomersTable from "@/components/tables/Customertable";
import { DollarSign, TrendingUp, UserPlus, Users } from "lucide-react";
import { getCustomersSummary } from "@/lib/api/customers";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "react-toastify";

export default function CustomersPage() {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    avgSpendPerCustomer: 0,
    newCustomersThisMonth: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const sum = await getCustomersSummary();
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load customers summary:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
     } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading customers..." className="h-screen" />;
  }

  // if (error) {
  //   return <ErrorState error={error} onRetry={loadData} className="h-screen" />;
  // }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          <EditableLabel labelKey="page_customers_title" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of customer-related metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Counters
          labelKey="total_customers_card"
          value={summary.totalCustomers.toLocaleString()}
          subtitle="Active customers"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="avg_customer_value_card"
          value={`$${summary.avgSpendPerCustomer.toFixed(0)}`}
          subtitle="Lifetime value"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="new_customers_card"
          value={summary.newCustomersThisMonth.toLocaleString()}
          subtitle="This month"
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
        />

        <Counters
          labelKey="growth_card"
          value={`${summary.growth > 0 ? "+" : ""}${summary.growth.toFixed(1)}%`}
          subtitle="Customer growth"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <CustomerAcquisitionChart />
        <CustomerLTVChart />
      </div>

      {/* Table */}
      <CustomersTable />
    </div>
  );
}
