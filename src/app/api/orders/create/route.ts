import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { plateStyles } from "@/style/PlateStyles";
import Stripe from "stripe";


export const runtime = "nodejs";

type PlateSidePayload = {
  styleName: string;
  sizeKey: string;
  borderType?: string | null;
  borderThickness?: number | null;
  gelName?: string | null;
};

type OrderItemPayload = {
  plateNumber: string;
  roadLegalSpacing: boolean;
  quantity: number;
  front?: PlateSidePayload;
  rear?: PlateSidePayload;
};

type CreateOrderPayload = {
  items: OrderItemPayload[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postal_code: string;
    country: string;
  };
};

function getBaseUrl(req: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  const origin = req.headers.get("origin");
  return origin ? origin.replace(/\/+$/, "") : "http://localhost:3000";
}

function lookupPrice(styleName: string, sizeKey: string, side: "front" | "rear") {
  const style = plateStyles.find((s) => s.name.trim() === styleName.trim());
  if (!style) return null;
  const sizes = side === "front" ? style.frontPlate.sizes : style.rearPlate.sizes;
  const size = sizes.find((sz) => sz.key === sizeKey);
  return size?.price ?? 0;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 501 },
    );
  }

  let payload: CreateOrderPayload;
  try {
    payload = (await req.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json({ error: "items must be a non-empty array." }, { status: 400 });
  }

  const customerEmail = String(payload.customerEmail ?? "").trim();
  const customerName = String(payload.customerName ?? "").trim();
  const customerPhone = String(payload.customerPhone ?? "").trim();
  if (!customerEmail || !customerName || !customerPhone) {
    return NextResponse.json(
      { error: "customerEmail, customerName, and customerPhone are required." },
      { status: 400 },
    );
  }

  const address = payload.shippingAddress;
  if (!address?.line1 || !address?.city || !address?.postal_code || !address?.country) {
    return NextResponse.json({ error: "shippingAddress is incomplete." }, { status: 400 });
  }

  const normalizedItems = payload.items.map((item, idx) => {
    const plateNumber = String(item.plateNumber ?? "").trim();
    if (!plateNumber) throw new Error(`items[${idx}].plateNumber is required.`);

    const quantity = Math.max(1, Math.floor(Number(item.quantity ?? 1)));

    const wantFront = !!item.front;
    const wantRear = !!item.rear;
    if (!wantFront && !wantRear) throw new Error(`items[${idx}] must include front or rear.`);

    const frontPrice = wantFront
      ? lookupPrice(item.front!.styleName, item.front!.sizeKey, "front")
      : 0;
    const rearPrice = wantRear
      ? lookupPrice(item.rear!.styleName, item.rear!.sizeKey, "rear")
      : 0;

    if (wantFront && frontPrice == null)
      throw new Error(`Unknown front style/size for items[${idx}].`);
    if (wantRear && rearPrice == null)
      throw new Error(`Unknown rear style/size for items[${idx}].`);

    return {
      plateNumber,
      roadLegalSpacing: !!item.roadLegalSpacing,
      quantity,
      frontStyle: wantFront ? item.front!.styleName : null,
      rearStyle: wantRear ? item.rear!.styleName : null,
      frontPrice: round2(Number(frontPrice ?? 0)),
      rearPrice: round2(Number(rearPrice ?? 0)),
      front: wantFront ? item.front! : null,
      rear: wantRear ? item.rear! : null,
    };
  });

  const totalAmount = round2(
    normalizedItems.reduce((acc, item) => {
      return acc + (item.frontPrice + item.rearPrice) * item.quantity;
    }, 0),
  );

  if (totalAmount <= 0) {
    return NextResponse.json({ error: "Order total is zero." }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      status: "pending",
      shippingLine1: address.line1,
      shippingLine2: address.line2 ?? null,
      shippingCity: address.city,
      shippingCounty: address.state ?? null,
      shippingPostcode: address.postal_code,
      shippingCountry: address.country,
      items: {
        create: normalizedItems.map((item) => ({
          plateNumber: item.plateNumber,
          frontStyle: item.frontStyle,
          rearStyle: item.rearStyle,
          frontPrice: item.frontPrice,
          rearPrice: item.rearPrice,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  const baseUrl = getBaseUrl(req);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
    cancel_url: `${baseUrl}/checkout/cancel?order_id=${order.id}`,
    customer_email: customerEmail,
    client_reference_id: order.id,
    metadata: {
      order_id: order.id,
    },
    line_items: normalizedItems.flatMap((item) => {
      // const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      const lineItems = [];

      if (item.front) {
        lineItems.push({
          quantity: item.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(item.frontPrice * 100),
            product_data: {
              name: `Front number plate (${item.plateNumber})`,
              metadata: {
                plate_number: item.plateNumber,
                side: "front",
                style: item.front.styleName,
                size: item.front.sizeKey,
                border_type: item.front.borderType ?? "",
                border_thickness: String(item.front.borderThickness ?? ""),
                gel: item.front.gelName ?? "",
              },
            },
          },
        });
      }

      if (item.rear) {
        lineItems.push({
          quantity: item.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(item.rearPrice * 100),
            product_data: {
              name: `Rear number plate (${item.plateNumber})`,
              metadata: {
                plate_number: item.plateNumber,
                side: "rear",
                style: item.rear.styleName,
                size: item.rear.sizeKey,
                border_type: item.rear.borderType ?? "",
                border_thickness: String(item.rear.borderThickness ?? ""),
                gel: item.rear.gelName ?? "",
              },
            },
          },
        });
      }

      return lineItems;
    }),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url, orderId: order.id, sessionId: session.id });
}
