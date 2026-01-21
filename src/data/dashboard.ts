// data/dashboard.ts

import { RegionRevenue, RevenuePoint } from "@/app/types/dashboard"

 
export const revenueData: RevenuePoint[] = [
  { label: "Jan", value: 12000 },
  { label: "Feb", value: 18000 },
  { label: "Mar", value: 15000 },
  { label: "Apr", value: 22000 },
  { label: "May", value: 24000 },
  { label: "Jun", value: 33000 },
]

export const regionRevenue: RegionRevenue[] = [
  { region: "USA", revenue: 42000 },
  { region: "Europe", revenue: 32000 },
  { region: "India", revenue: 28000 },
  { region: "Asia", revenue: 22000 },
]
