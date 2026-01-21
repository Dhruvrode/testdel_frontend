import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const BACKEND_URL = process.env.BACKEND_URL!;
  const { searchParams } = new URL(req.url);

  const res = await fetch(
    `${BACKEND_URL}/customers?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
