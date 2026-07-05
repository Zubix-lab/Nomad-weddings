import { NextResponse } from "next/server";
import { getOfficialRunbook } from "@/lib/official-agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { eventId?: string };

  if (!payload.eventId) {
    return NextResponse.json({ error: "eventId es obligatorio" }, { status: 400 });
  }

  const runbook = await getOfficialRunbook(payload.eventId);
  if (!runbook) {
    return NextResponse.json({ error: "Boda no encontrada en Firestore" }, { status: 404 });
  }

  return NextResponse.json(runbook);
}
