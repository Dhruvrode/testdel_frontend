export interface Customer {
  customerId: string;
  name: string;
  orders: number;
  spend: number;
  region: string;
  joinedAt: string;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getCustomers(params: {
  page: number;
  pageSize: number;
  search?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  region?: string;
  month?: number | "";
}): Promise<CustomersResponse> {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val !== undefined) {
      qs.set(key, String(val));
    }
  });

  const res = await fetch(`/api/customers?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || "Failed to load customers";
    const details = errorData.details || "";
    throw new Error(`${message}${details ? `: ${details}` : ""}`);
  }

  return res.json();
}

export async function getCustomersSummary() {
  const res = await fetch("/api/customers/summary", { cache: "no-store" });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch customers summary");
  }
  
  return res.json();
}