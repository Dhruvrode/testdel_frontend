export interface RevenuePoint {
  label: string
  value: number
}

export interface RegionRevenue {
  region: string
  revenue: number
}

export type SaleStatus = 0 | 1 | 2;

export interface Sale {
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  status: SaleStatus;
  region: string;
}

export interface SalesResponse {
  data: Sale[];
  total: number;
}