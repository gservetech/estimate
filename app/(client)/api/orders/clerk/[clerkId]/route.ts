import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  const { clerkId } = await params;
  console.log("API Route - Fetching orders for clerkId:", clerkId);

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/api/orders/clerk/${clerkId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Route - Backend response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch orders from backend");
    }

    const orders = await response.json();
    console.log("API Route - Orders retrieved:", orders.length);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("API Route - Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
