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

type CheckoutItemPayload = {
  plateNumber: string;
  roadLegalSpacing: boolean;
  quantity?: number;
  front?: PlateSidePayload;
  rear?: PlateSidePayload;
};

type ShippingAddressPayload = {
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country: string;
};

type CheckoutPayload =
  | {
      items: CheckoutItemPayload[];
      customerEmail?: string;
      customerName?: string;
      customerPhone?: string;
      shippingAddress?: ShippingAddressPayload;
    }
  | (CheckoutItemPayload & {
      // legacy single-item payload
      wantFront?: boolean;
      wantBack?: boolean;
    });

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

  const orderItems: CheckoutItemPayload[] =
    "items" in payload ? payload.items : [payload];

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return NextResponse.json({ error: "items must be a non-empty array." }, { status: 400 });
  }

  const items: Array<{
    name: string;
    unit_amount: number;
    quantity: number;
    metadata: Record<string, string>;
  }> = [];

  for (let idx = 0; idx < orderItems.length; idx += 1) {
    const orderItem = orderItems[idx];
    const plateNumber = (orderItem.plateNumber ?? "").toString().trim();
    if (!plateNumber) {
      return NextResponse.json(
        { error: `items[${idx}].plateNumber is required.` },
        { status: 400 },
      );
    }

    const quantity = Math.max(1, Math.floor(Number(orderItem.quantity ?? 1)));
    const wantFront = !!orderItem.front;
    const wantRear = !!orderItem.rear;
    if (!wantFront && !wantRear) {
      return NextResponse.json(
        { error: `items[${idx}] must include front or rear.` },
        { status: 400 },
      );
    }

    if (wantFront) {
      const price = lookupPrice(orderItem.front!.styleName, orderItem.front!.sizeKey, "front");
      if (price == null) {
        return NextResponse.json(
          { error: `Unknown front style/size for items[${idx}].` },
          { status: 400 },
        );
      }
      const unitAmount = toPence(price);
      if (unitAmount <= 0) {
        return NextResponse.json(
          { error: `Front plate price is zero for items[${idx}].` },
          { status: 400 },
        );
      }

      items.push({
        name: `Front number plate (${plateNumber})`,
        unit_amount: unitAmount,
        quantity,
        metadata: {
          plate_number: plateNumber,
          road_legal_spacing: orderItem.roadLegalSpacing ? "true" : "false",
          side: "front",
          style: orderItem.front!.styleName,
          size: orderItem.front!.sizeKey,
          border_type: orderItem.front!.borderType ?? "",
          border_thickness: (orderItem.front!.borderThickness ?? "").toString(),
          gel: orderItem.front!.gelName ?? "",
        },
      });
    }

    if (wantRear) {
      const price = lookupPrice(orderItem.rear!.styleName, orderItem.rear!.sizeKey, "rear");
      if (price == null) {
        return NextResponse.json(
          { error: `Unknown rear style/size for items[${idx}].` },
          { status: 400 },
        );
      }
      const unitAmount = toPence(price);
      if (unitAmount <= 0) {
        return NextResponse.json(
          { error: `Rear plate price is zero for items[${idx}].` },
          { status: 400 },
        );
      }

      items.push({
        name: `Rear number plate (${plateNumber})`,
        unit_amount: unitAmount,
        quantity,
        metadata: {
          plate_number: plateNumber,
          road_legal_spacing: orderItem.roadLegalSpacing ? "true" : "false",
          side: "rear",
          style: orderItem.rear!.styleName,
          size: orderItem.rear!.sizeKey,
          border_type: orderItem.rear!.borderType ?? "",
          border_thickness: (orderItem.rear!.borderThickness ?? "").toString(),
          gel: orderItem.rear!.gelName ?? "",
        },
      });
    }
  }

  const baseUrl = getBaseUrl(req);

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${baseUrl}/checkout/cancel`);

  if ("items" in payload) {
    if (payload.customerEmail) params.set("customer_email", payload.customerEmail);
    if (payload.customerName) params.set("metadata[customer_name]", payload.customerName);
    if (payload.customerPhone) params.set("metadata[customer_phone]", payload.customerPhone);
    if (payload.shippingAddress) {
      const a = payload.shippingAddress;
      params.set("metadata[ship_line1]", a.line1);
      if (a.line2) params.set("metadata[ship_line2]", a.line2);
      params.set("metadata[ship_city]", a.city);
      if (a.state) params.set("metadata[ship_state]", a.state);
      params.set("metadata[ship_postal_code]", a.postal_code);
      params.set("metadata[ship_country]", a.country);
    }
  }

  items.forEach((item, i) => {
    params.set(`line_items[${i}][quantity]`, item.quantity.toString());
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

  const json = (await stripeRes.json()) as
    | { url?: string; id?: string; error?: { message?: string } }
    | Record<string, unknown>;
  if (!stripeRes.ok) {
    return NextResponse.json(
      {
        error: "Stripe error creating checkout session.",
        details:
          typeof json === "object" && json && "error" in json
            ? (json as { error?: { message?: string } }).error?.message ?? json
            : json,
      },
      { status: 500 },
    );
  }

  const ok = typeof json === "object" && json ? (json as { url?: string; id?: string }) : {};
  return NextResponse.json({ url: ok.url, id: ok.id });
}
