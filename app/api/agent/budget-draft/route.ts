import { NextResponse } from "next/server";
import { getOfficialBudgetDraft } from "@/lib/official-agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { eventId?: string };

  if (!payload.eventId) {
    return NextResponse.json({ error: "eventId es obligatorio" }, { status: 400 });
  }

  const draft = await getOfficialBudgetDraft(payload.eventId);
  if (!draft) {
    return NextResponse.json({ error: "Boda no encontrada en Firestore" }, { status: 404 });
  }

  return NextResponse.json(draft);
}
