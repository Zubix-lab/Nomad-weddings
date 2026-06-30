import { NextResponse } from "next/server";
import { draftReplyForLead } from "@/lib/agent";

export async function POST(request: Request) {
  const payload = (await request.json()) as { leadId?: string };

  if (!payload.leadId) {
    return NextResponse.json({ error: "leadId es obligatorio" }, { status: 400 });
  }

  return NextResponse.json(draftReplyForLead(payload.leadId));
}
