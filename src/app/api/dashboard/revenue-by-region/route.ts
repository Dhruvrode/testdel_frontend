import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.BACKEND_URL}/dashboard/revenue-by-region`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { message: "Failed to fetch region revenue" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
