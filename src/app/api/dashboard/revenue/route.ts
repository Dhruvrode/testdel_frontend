import { NextResponse } from "next/server";

export async function GET() {
  const BACKEND_URL = process.env.BACKEND_URL;

  // Validate environment variable
  if (!BACKEND_URL) {
    console.error(" BACKEND_URL is not set in .env.local");
    return NextResponse.json(
      { 
        error: "Backend configuration missing",
        details: "BACKEND_URL environment variable is not set. Please check your .env.local file."
      },
      { status: 500 }
    );
  }

  try {
    console.log(`🔄 Fetching revenue from: ${BACKEND_URL}/dashboard/revenue`);
    
    const res = await fetch(`${BACKEND_URL}/dashboard/revenue`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(` Backend returned ${res.status}: ${errorText}`);
      
      return NextResponse.json(
        { 
          error: "Backend service unavailable",
          details: `Backend returned status ${res.status}`,
          suggestion: "Make sure your backend is running on the configured port"
        },
        { status: 502 } // Bad Gateway
      );
    }

    const data = await res.json();
    console.log("✅ Revenue data fetched successfully");
    return NextResponse.json(data);
    
  } catch (err) {
    console.error(" Network error:", err);
    return NextResponse.json(
      { 
        error: "Cannot connect to backend",
        details: err instanceof Error ? err.message : "Unknown error",
        suggestion: `Check if backend is running at ${BACKEND_URL}`
      },
      { status: 503 } // Service Unavailable
    );
  }
}