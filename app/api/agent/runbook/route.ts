import { NextResponse } from "next/server";
import { runbook } from "@/lib/agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { eventId?: string };

  if (!payload.eventId) {
    return NextResponse.json({ error: "eventId es obligatorio" }, { status: 400 });
  }

  return NextResponse.json(runbook(payload.eventId));
}
