import { NextResponse } from "next/server";
import { getOfficialLeadReply } from "@/lib/official-agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { leadId?: string };

  if (!payload.leadId) {
    return NextResponse.json({ error: "leadId es obligatorio" }, { status: 400 });
  }

  const reply = await getOfficialLeadReply(payload.leadId);
  if (!reply) {
    return NextResponse.json({ error: "Lead no encontrado en Firestore" }, { status: 404 });
  }

  return NextResponse.json(reply);
}
