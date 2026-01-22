import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const pageSize = Math.min(
      Math.max(Number(searchParams.get("pageSize") ?? 10), 1),
      100
    );

    const sortKey = searchParams.get("sortKey") ?? "date";
    const sortDir =
      searchParams.get("sortDir") === "asc" ? "asc" : "desc";

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status");
    const region = searchParams.get("region");
    const month = searchParams.get("month");

    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sortKey,
      sortDir,
      search,
    });

    if (status !== null) qs.set("status", status);
    if (region) qs.set("region", region);
    if (month !== null) qs.set("month", month);

     const res = await fetch(`${BACKEND_URL}/orders?${qs.toString()}`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: res.status }
      );
    }

    const backendResponse = await res.json();
 

    return NextResponse.json({
      data: backendResponse.data,
      total: backendResponse.total,
      page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
