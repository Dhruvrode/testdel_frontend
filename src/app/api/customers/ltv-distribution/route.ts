// app/api/customers/ltv-distribution/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/customers/ltv-distribution`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
  return NextResponse.json(await res.json());
}