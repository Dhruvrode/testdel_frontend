import { NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:4000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/labels`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch labels" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Backend unavailable" },
      { status: 500 }
    )
  }
}
