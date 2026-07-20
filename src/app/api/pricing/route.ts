import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: current price overrides, consumed by the plate builder
export async function GET() {
  try {
    const rows = await prisma.priceOverride.findMany();
    return NextResponse.json({
      overrides: rows.map((r) => ({
        kind: r.kind,
        styleName: r.styleName,
        key: r.key,
        price: Number(r.price),
      })),
    });
  } catch {
    // If the table doesn't exist yet, fall back to defaults silently
    return NextResponse.json({ overrides: [] });
  }
}
