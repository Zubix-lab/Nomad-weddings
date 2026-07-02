import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type PhotoMediaResponse = {
  name?: string;
  photoUri?: string;
};

function getPlacesKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
}

export async function GET(request: Request) {
  const apiKey = getPlacesKey();
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");
  const maxWidth = Math.min(Math.max(Number(searchParams.get("maxWidth")) || 1400, 1), 4800);

  if (!apiKey) {
    return NextResponse.json({ message: "Google Places API key is not configured." }, { status: 503 });
  }

  if (!photoName || !photoName.startsWith("places/")) {
    return NextResponse.json({ message: "Invalid Google photo name." }, { status: 400 });
  }

  const photoUrl = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
  photoUrl.searchParams.set("maxWidthPx", String(maxWidth));
  photoUrl.searchParams.set("skipHttpRedirect", "true");
  photoUrl.searchParams.set("key", apiKey);

  const response = await fetch(photoUrl, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { message: `Google photo request failed with ${response.status}.` },
      { status: response.status }
    );
  }

  const media = await response.json() as PhotoMediaResponse;
  if (!media.photoUri) {
    return NextResponse.json({ message: "Google did not return a photo URI." }, { status: 404 });
  }

  return NextResponse.redirect(media.photoUri, {
    headers: {
      "Cache-Control": "public, max-age=3600"
    }
  });
}
