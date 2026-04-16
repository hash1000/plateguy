import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured (missing STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET)." },
      { status: 501 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid webhook signature.", details: err?.message ?? String(err) },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object as { id?: string; metadata?: Record<string, string> };
    const orderId = session?.metadata?.order_id;

    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { status: "paid" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
