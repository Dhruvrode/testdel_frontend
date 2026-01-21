import { NextResponse } from "next/server";

export async function GET() {
  const BACKEND_URL = process.env.BACKEND_URL!;

  const res = await fetch(`${BACKEND_URL}/dashboard/revenue`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
