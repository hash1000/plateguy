import { NextResponse } from "next/server";
import { plateStyles } from "@/style/PlateStyles";

export const runtime = "nodejs";

type PlateSidePayload = {
  styleName: string;
  sizeKey: string;
  borderType?: string | null;
  borderThickness?: number | null;
  gelName?: string | null;
};

type CheckoutPayload = {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  front?: PlateSidePayload;
  rear?: PlateSidePayload;
};

function toPence(amount: number) {
  return Math.max(0, Math.round(amount * 100));
}

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

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 501 },
    );
  }

  let payload: CheckoutPayload;
  try {
    payload = (await req.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const plateNumber = (payload.plateNumber ?? "").toString().trim();
  if (!plateNumber) {
    return NextResponse.json({ error: "plateNumber is required." }, { status: 400 });
  }

  const wantFront = !!payload.wantFront;
  const wantBack = !!payload.wantBack;
  if (!wantFront && !wantBack) {
    return NextResponse.json(
      { error: "Select at least one plate (front or rear)." },
      { status: 400 },
    );
  }

  const items: Array<{ name: string; unit_amount: number; metadata: Record<string, string> }> =
    [];

  if (wantFront) {
    if (!payload.front) {
      return NextResponse.json({ error: "front is required." }, { status: 400 });
    }
    const price = lookupPrice(payload.front.styleName, payload.front.sizeKey, "front");
    if (price == null) {
      return NextResponse.json(
        { error: "Unknown front style/size selection." },
        { status: 400 },
      );
    }
    const unitAmount = toPence(price);
    if (unitAmount <= 0) {
      return NextResponse.json(
        { error: "Front plate price is zero; cannot create a payment checkout." },
        { status: 400 },
      );
    }

    items.push({
      name: "Front number plate",
      unit_amount: unitAmount,
      metadata: {
        side: "front",
        style: payload.front.styleName,
        size: payload.front.sizeKey,
        border_type: payload.front.borderType ?? "",
        border_thickness: (payload.front.borderThickness ?? "").toString(),
        gel: payload.front.gelName ?? "",
      },
    });
  }

  if (wantBack) {
    if (!payload.rear) {
      return NextResponse.json({ error: "rear is required." }, { status: 400 });
    }
    const price = lookupPrice(payload.rear.styleName, payload.rear.sizeKey, "rear");
    if (price == null) {
      return NextResponse.json(
        { error: "Unknown rear style/size selection." },
        { status: 400 },
      );
    }
    const unitAmount = toPence(price);
    if (unitAmount <= 0) {
      return NextResponse.json(
        { error: "Rear plate price is zero; cannot create a payment checkout." },
        { status: 400 },
      );
    }

    items.push({
      name: "Rear number plate",
      unit_amount: unitAmount,
      metadata: {
        side: "rear",
        style: payload.rear.styleName,
        size: payload.rear.sizeKey,
        border_type: payload.rear.borderType ?? "",
        border_thickness: (payload.rear.borderThickness ?? "").toString(),
        gel: payload.rear.gelName ?? "",
      },
    });
  }

  const baseUrl = getBaseUrl(req);

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${baseUrl}/checkout/cancel`);

  params.set("metadata[plate_number]", plateNumber);
  params.set("metadata[road_legal_spacing]", payload.roadLegalSpacing ? "true" : "false");

  items.forEach((item, i) => {
    params.set(`line_items[${i}][quantity]`, "1");
    params.set(`line_items[${i}][price_data][currency]`, "gbp");
    params.set(`line_items[${i}][price_data][unit_amount]`, item.unit_amount.toString());
    params.set(`line_items[${i}][price_data][product_data][name]`, item.name);
    Object.entries(item.metadata).forEach(([k, v]) => {
      params.set(`line_items[${i}][price_data][product_data][metadata][${k}]`, v);
    });
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await stripeRes.json()) as any;
  if (!stripeRes.ok) {
    return NextResponse.json(
      {
        error: "Stripe error creating checkout session.",
        details: json?.error?.message ?? json,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: json?.url, id: json?.id });
}
