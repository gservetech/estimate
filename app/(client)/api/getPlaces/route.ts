import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      {
        error: "Query is required",
      },
      { status: 404 }
    );
  }

  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?&access_token=${mapboxAccessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch from Mapbox API");
  }

  const data = await response.json();

  return NextResponse.json(
    { data },
    {
      status: 200,
    }
  );
}
