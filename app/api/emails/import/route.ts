import { NextResponse } from "next/server";
import { communications } from "@/lib/seed";
import type { Communication } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Communication>;

  if (!payload.subject || !payload.body) {
    return NextResponse.json({ error: "subject y body son obligatorios" }, { status: 400 });
  }

  const body = String(payload.body);
  const communication: Communication = {
    id: `comm-${Date.now()}`,
    eventId: payload.eventId,
    leadId: payload.leadId,
    channel: "email",
    subject: String(payload.subject),
    body,
    summary: summarizeEmail(body),
    createdAt: new Date().toISOString().slice(0, 10)
  };

  communications.unshift(communication);
  return NextResponse.json({ communication }, { status: 201 });
}

function summarizeEmail(body: string) {
  const compact = body.replace(/\s+/g, " ").trim();
  return compact.length <= 180 ? compact : `${compact.slice(0, 177)}...`;
}
