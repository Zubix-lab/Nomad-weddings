import { NextResponse } from "next/server";
import { eventBrief } from "@/lib/agent";

export async function GET(_: Request, context: { params: { id: string } }) {
  return NextResponse.json(eventBrief(context.params.id));
}
