// import { NextResponse } from "next/server"

// const BACKEND_URL = process.env.BACKEND_URL!;

// type Params = {
//   params: {
//     key: string
//   }
// }

// export async function PUT(req: Request, { params }: Params) {
//   try {
//     const body = await req.json()

//     const res = await fetch(`${BACKEND_URL}/labels/${params.key}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     })

//     if (!res.ok) {
//       return NextResponse.json(
//         { error: "Failed to update label" },
//         { status: res.status }
//       )
//     }

//     const data = await res.json()
//     return NextResponse.json(data)
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Backend unavailable" },
//       { status: 500 }
//     )
//   }
// }
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/labels/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update label" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Backend unavailable" },
      { status: 500 }
    );
  }
}
