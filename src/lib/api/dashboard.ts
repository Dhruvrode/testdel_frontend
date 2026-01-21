import { RevenuePoint, SalesResponse ,RegionRevenue } from "@/app/types/dashboard";
 
 
export type DashboardSummary = {
  revenue: number;
  orders: number;
  avgOrder: number;
  growth: number;
};



export async function getRevenueData(): Promise<RevenuePoint[]> {
  const res = await fetch("/api/dashboard/revenue", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load revenue data");
  }

  return res.json();
}


export async function getRegionRevenue(): Promise<RegionRevenue[]> {
  const res = await fetch("/api/dashboard/revenue-by-region");
  if (!res.ok) throw new Error("Failed to fetch region revenue");
  return res.json();
}


export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch("/api/dashboard/summary", {
    cache: "no-store",  
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}



async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error("Failed to load sales");
  }
  return res.json();
}

export async function getSales(params: {
  page: number;
  pageSize: number;
  search?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  status?: number | "";
  region?: string;
  month?: number | "";
}): Promise<SalesResponse> {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val !== undefined) {
      qs.set(key, String(val));
    }
  });

  const res = await fetch(`/api/orders?${qs.toString()}`, {
    cache: "no-store",
  });

  return handle(res);
}