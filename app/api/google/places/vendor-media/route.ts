import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoogleLocalizedText = {
  text?: string;
  languageCode?: string;
};

type GoogleAttribution = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

type GooglePhoto = {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: GoogleAttribution[];
};

type GoogleReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: GoogleLocalizedText;
  originalText?: GoogleLocalizedText;
  authorAttribution?: GoogleAttribution;
  publishTime?: string;
};

type GooglePlace = {
  id?: string;
  name?: string;
  displayName?: GoogleLocalizedText;
  formattedAddress?: string;
  googleMapsUri?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  photos?: GooglePhoto[];
  reviews?: GoogleReview[];
};

const DETAILS_FIELD_MASK = [
  "id",
  "name",
  "displayName",
  "formattedAddress",
  "googleMapsUri",
  "websiteUri",
  "rating",
  "userRatingCount",
  "photos",
  "reviews"
].join(",");

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.name",
  "places.displayName",
  "places.formattedAddress",
  "places.googleMapsUri"
].join(",");

function getPlacesKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
}

function jsonError(message: string, status = 502) {
  return NextResponse.json(
    {
      configured: true,
      message,
      photos: [],
      reviews: []
    },
    { status }
  );
}

async function fetchGoogleJson<T>(url: string, apiKey: string, fieldMask?: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      ...(fieldMask ? { "X-Goog-FieldMask": fieldMask } : {}),
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Places ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}

async function resolvePlaceId(params: {
  apiKey: string;
  vendorName: string;
  region?: string | null;
  lat?: string | null;
  lng?: string | null;
}) {
  const { apiKey, vendorName, region, lat, lng } = params;
  const query = [vendorName, region].filter(Boolean).join(", ");
  const body: Record<string, unknown> = {
    textQuery: query,
    pageSize: 1,
    languageCode: "es"
  };

  const latNumber = Number(lat);
  const lngNumber = Number(lng);
  if (Number.isFinite(latNumber) && Number.isFinite(lngNumber)) {
    body.locationBias = {
      circle: {
        center: {
          latitude: latNumber,
          longitude: lngNumber
        },
        radius: 1500
      }
    };
  }

  const result = await fetchGoogleJson<{ places?: GooglePlace[] }>(
    "https://places.googleapis.com/v1/places:searchText",
    apiKey,
    SEARCH_FIELD_MASK,
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );

  return result.places?.[0]?.id;
}

function normalizePhotos(photos: GooglePhoto[] | undefined) {
  return (photos || [])
    .filter((photo) => photo.name)
    .slice(0, 10)
    .map((photo) => ({
      name: photo.name,
      url: `/api/google/places/photo?name=${encodeURIComponent(photo.name || "")}&maxWidth=1400`,
      widthPx: photo.widthPx,
      heightPx: photo.heightPx,
      authorAttributions: (photo.authorAttributions || []).map((author) => ({
        displayName: author.displayName || "Usuario de Google",
        uri: author.uri || "",
        photoUri: author.photoUri || ""
      }))
    }));
}

function normalizeReviews(reviews: GoogleReview[] | undefined) {
  return (reviews || []).slice(0, 5).map((review) => ({
    id: review.name || `${review.authorAttribution?.displayName || "review"}-${review.publishTime || ""}`,
    rating: review.rating || 0,
    text: review.text?.text || review.originalText?.text || "",
    relativePublishTimeDescription: review.relativePublishTimeDescription || "",
    publishTime: review.publishTime || "",
    author: {
      displayName: review.authorAttribution?.displayName || "Usuario de Google",
      uri: review.authorAttribution?.uri || "",
      photoUri: review.authorAttribution?.photoUri || ""
    }
  }));
}

export async function GET(request: Request) {
  const apiKey = getPlacesKey();
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      message: "Configura GOOGLE_PLACES_API_KEY o GOOGLE_MAPS_API_KEY para cargar fotos y resenas reales de Google.",
      photos: [],
      reviews: []
    });
  }

  const { searchParams } = new URL(request.url);
  const vendorName = searchParams.get("name")?.trim();
  const region = searchParams.get("region");
  const providedPlaceId = searchParams.get("placeId")?.trim();

  if (!providedPlaceId && !vendorName) {
    return NextResponse.json(
      { configured: true, message: "Falta name o placeId.", photos: [], reviews: [] },
      { status: 400 }
    );
  }

  try {
    const placeId = providedPlaceId || await resolvePlaceId({
      apiKey,
      vendorName: vendorName || "",
      region,
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng")
    });

    if (!placeId) {
      return NextResponse.json({
        configured: true,
        message: "No se encontro una ficha de Google Places para este proveedor.",
        photos: [],
        reviews: []
      });
    }

    const place = await fetchGoogleJson<GooglePlace>(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      apiKey,
      DETAILS_FIELD_MASK
    );

    return NextResponse.json({
      configured: true,
      place: {
        id: place.id || placeId,
        resourceName: place.name || "",
        displayName: place.displayName?.text || vendorName || "",
        formattedAddress: place.formattedAddress || "",
        googleMapsUri: place.googleMapsUri || "",
        websiteUri: place.websiteUri || "",
        rating: place.rating,
        userRatingCount: place.userRatingCount
      },
      photos: normalizePhotos(place.photos),
      reviews: normalizeReviews(place.reviews),
      message: ""
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Error consultando Google Places.");
  }
}
