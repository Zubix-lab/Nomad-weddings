import { NextResponse } from "next/server";
import { eventBrief } from "@/lib/agent";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json(eventBrief(id));
}
