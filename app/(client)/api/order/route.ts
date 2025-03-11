import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { order } = body;

  const response = await fetch(`${process.env.SERVER_URL!}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order }),
  });

  if (!response.ok) {
    NextResponse.json(
      {
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { data: await response.json() },
    {
      status: 200,
    }
  );
}
