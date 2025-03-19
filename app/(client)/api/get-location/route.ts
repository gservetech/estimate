import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract the user's IP address from request headers
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || // Multiple IPs possible in proxies
    req.headers.get("cf-connecting-ip") || // If using Cloudflare
    req.headers.get("x-real-ip") || // Some proxies use this
    "8.8.8.8"; // Default IP for testing

  if (!ip) {
    return NextResponse.json(
      { error: "IP address not found" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ip });
}
