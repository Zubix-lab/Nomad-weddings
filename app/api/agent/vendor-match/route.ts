import { NextResponse } from "next/server";
import { getOfficialVendorMatches } from "@/lib/official-agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { eventId?: string; category?: string };

  if (!payload.eventId || !payload.category) {
    return NextResponse.json({ error: "eventId y category son obligatorios" }, { status: 400 });
  }

  const matches = await getOfficialVendorMatches(payload.eventId, payload.category);
  if (!matches) {
    return NextResponse.json({ error: "Boda no encontrada en Firestore" }, { status: 404 });
  }

  return NextResponse.json({ matches });
}
