import { NextResponse } from "next/server";
import { matchVendors } from "@/lib/agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { eventId?: string; category?: string };

  if (!payload.eventId || !payload.category) {
    return NextResponse.json({ error: "eventId y category son obligatorios" }, { status: 400 });
  }

  return NextResponse.json({ matches: matchVendors(payload.eventId, payload.category) });
}
