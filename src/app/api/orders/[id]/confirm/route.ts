import { NextResponse } from "next/server";
import { orders } from "@/lib/server/orders";

export const runtime = "nodejs";

type ConfirmPayload = { paymentIntentId?: string };

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = orders.get(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  let payload: ConfirmPayload | undefined;
  try {
    payload = (await req.json()) as ConfirmPayload;
  } catch {
    payload = undefined;
  }

  const updated = orders.update(id, {
    status: "paid",
    paymentIntentId: payload?.paymentIntentId ?? order.paymentIntentId,
  });

  return NextResponse.json({ order: updated });
}

