import { NextResponse } from "next/server";
import { orders } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.get(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

