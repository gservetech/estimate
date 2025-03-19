import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract the user's IP address from request headers
    const ip =
      req.headers.get("x-forwarded-for") || req.ip || "8.8.8.8"; // Default IP for testing

    if (!ip) {
      return NextResponse.json({ error: "IP address not found" }, { status: 400 });
    }

    // Fetch country from IP using ip-api.com (free, no API key required)
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status !== "success") {
      return NextResponse.json({ error: "Failed to determine location" }, { status: 500 });
    }

    return NextResponse.json({ country: data.countryCode }); // Returns "CA" for Canada, "US" for USA
  } catch (error) {
    console.error("Location error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
