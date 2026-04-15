import { NextResponse } from "next/server";
import type { Basket } from "@/lib/basket";
import { basketToOrderDraft, orders } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const basket = body as Basket;
  try {
    const draft = basketToOrderDraft(basket);
    const order = orders.create(draft);
    return NextResponse.json({ orderId: order.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

