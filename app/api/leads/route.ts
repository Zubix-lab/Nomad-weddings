import { NextResponse } from "next/server";
import { scoreLead } from "@/lib/lead-scoring";
import { readApiCollection, writeApiDocument } from "@/lib/api-firestore";
import type { Lead } from "@/lib/types";

export async function GET() {
  const leads = await readApiCollection<Lead>("leads");
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Lead>;
  const required = ["coupleName", "phone", "email", "eventDate", "location", "budget", "guests", "requestedService"] as const;
  const missing = required.filter((field) => payload[field] === undefined || payload[field] === "");

  if (missing.length > 0) {
    return NextResponse.json({ error: "Campos obligatorios incompletos", missing }, { status: 400 });
  }

  const scoring = scoreLead({
    budget: Number(payload.budget),
    guests: Number(payload.guests),
    eventDate: String(payload.eventDate),
    location: String(payload.location),
    requestedService: String(payload.requestedService)
  });

  const lead: Lead = {
    id: `lead-${Date.now()}`,
    source: payload.source ?? "web",
    coupleName: String(payload.coupleName),
    phone: String(payload.phone),
    email: String(payload.email),
    eventDate: String(payload.eventDate),
    location: String(payload.location),
    budget: Number(payload.budget),
    guests: Number(payload.guests),
    requestedService: String(payload.requestedService),
    status: "new",
    priority: scoring.priority,
    summary: scoring.reasons.join(" "),
    nextAction: scoring.nextAction,
    createdAt: new Date().toISOString().slice(0, 10),
    consent: Boolean(payload.consent)
  };

  await writeApiDocument("leads", lead);
  return NextResponse.json({ lead, scoring }, { status: 201 });
}
