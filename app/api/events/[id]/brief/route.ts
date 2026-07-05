import { NextResponse } from "next/server";
import { getOfficialEventBrief } from "@/lib/official-agent";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const brief = await getOfficialEventBrief(id);
  if (!brief) {
    return NextResponse.json({ error: "Boda no encontrada en Firestore" }, { status: 404 });
  }
  return NextResponse.json(brief);
}
