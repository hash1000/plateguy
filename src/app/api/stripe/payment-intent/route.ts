import { NextResponse } from "next/server";
import { plateStyles } from "@/style/PlateStyles";
import type { Basket } from "@/lib/basket";

export const runtime = "nodejs";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
};

type PaymentIntentPayload = {
  basket: Basket;
  customer: CustomerInfo;
};

function toPence(amount: number) {
  return Math.max(0, Math.round(amount * 100));
}

function lookupPrice(styleName: string, sizeKey: string, side: "front" | "rear") {
  const style = plateStyles.find((s) => s.name.trim() === styleName.trim());
  if (!style) return null;
  const sizes = side === "front" ? style.frontPlate.sizes : style.rearPlate.sizes;
  const size = sizes.find((sz) => sz.key === sizeKey);
  return size?.price ?? 0;
}

function str(v: unknown) {
  return (v ?? "").toString().trim();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function readStripeErrorDetails(json: unknown) {
  if (!isObject(json)) return json;
  const err = json.error;
  if (!isObject(err)) return json;
  const message = err.message;
  return typeof message === "string" ? message : json;
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 501 },
    );
  }

  let payload: PaymentIntentPayload;
  try {
    payload = (await req.json()) as PaymentIntentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const basket = payload?.basket as Basket | undefined;
  const customer = payload?.customer as CustomerInfo | undefined;

  if (!basket || !customer) {
    return NextResponse.json({ error: "basket and customer are required." }, { status: 400 });
  }

  const plateNumber = str(basket.plateNumber);
  if (!plateNumber) {
    return NextResponse.json({ error: "plateNumber is required." }, { status: 400 });
  }

  const wantFront = !!basket.wantFront;
  const wantBack = !!basket.wantBack;
  if (!wantFront && !wantBack) {
    return NextResponse.json(
      { error: "Select at least one plate (front or rear)." },
      { status: 400 },
    );
  }

  const name = str(customer.name);
  const email = str(customer.email);
  const phone = str(customer.phone);
  const address1 = str(customer.address1);
  const address2 = str(customer.address2);
  const city = str(customer.city);
  const county = str(customer.county);
  const postcode = str(customer.postcode);
  const country = str(customer.country) || "GB";

  if (!name || !email || !phone || !address1 || !city || !postcode || !country) {
    return NextResponse.json(
      { error: "Missing required customer fields." },
      { status: 400 },
    );
  }

  let total = 0;

  if (wantFront) {
    if (!basket.front) {
      return NextResponse.json({ error: "front is required." }, { status: 400 });
    }
    const price = lookupPrice(basket.front.styleName, basket.front.sizeKey, "front");
    if (price == null) {
      return NextResponse.json(
        { error: "Unknown front style/size selection." },
        { status: 400 },
      );
    }
    total += price;
  }

  if (wantBack) {
    if (!basket.rear) {
      return NextResponse.json({ error: "rear is required." }, { status: 400 });
    }
    const price = lookupPrice(basket.rear.styleName, basket.rear.sizeKey, "rear");
    if (price == null) {
      return NextResponse.json(
        { error: "Unknown rear style/size selection." },
        { status: 400 },
      );
    }
    total += price;
  }

  const amount = toPence(total);
  if (amount <= 0) {
    return NextResponse.json(
      { error: "Order total is zero; cannot create a payment." },
      { status: 400 },
    );
  }

  const params = new URLSearchParams();
  params.set("amount", amount.toString());
  params.set("currency", "gbp");
  params.set("payment_method_types[0]", "card");
  params.set("receipt_email", email);
  params.set("description", `PlateGuy order (${plateNumber})`);

  params.set("metadata[plate_number]", plateNumber);
  params.set("metadata[road_legal_spacing]", basket.roadLegalSpacing ? "true" : "false");
  params.set("metadata[want_front]", wantFront ? "true" : "false");
  params.set("metadata[want_rear]", wantBack ? "true" : "false");

  if (wantFront && basket.front) {
    params.set("metadata[front_style]", basket.front.styleName);
    params.set("metadata[front_size]", basket.front.sizeKey);
    if (basket.front.borderType) params.set("metadata[front_border]", basket.front.borderType);
    if (basket.front.borderThickness != null) {
      params.set("metadata[front_border_thickness]", basket.front.borderThickness.toString());
    }
    if (basket.front.gelName) params.set("metadata[front_gel]", basket.front.gelName);
  }

  if (wantBack && basket.rear) {
    params.set("metadata[rear_style]", basket.rear.styleName);
    params.set("metadata[rear_size]", basket.rear.sizeKey);
    if (basket.rear.borderType) params.set("metadata[rear_border]", basket.rear.borderType);
    if (basket.rear.borderThickness != null) {
      params.set("metadata[rear_border_thickness]", basket.rear.borderThickness.toString());
    }
    if (basket.rear.gelName) params.set("metadata[rear_gel]", basket.rear.gelName);
  }

  // Shipping details
  params.set("shipping[name]", name);
  params.set("shipping[phone]", phone);
  params.set("shipping[address][line1]", address1);
  if (address2) params.set("shipping[address][line2]", address2);
  params.set("shipping[address][city]", city);
  if (county) params.set("shipping[address][state]", county);
  params.set("shipping[address][postal_code]", postcode);
  params.set("shipping[address][country]", country);

  const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await stripeRes.json()) as unknown;
  if (!stripeRes.ok) {
    return NextResponse.json(
      {
        error: "Stripe error creating payment intent.",
        details: readStripeErrorDetails(json),
      },
      { status: 500 },
    );
  }

  if (!isObject(json)) {
    return NextResponse.json(
      { error: "Stripe response was invalid." },
      { status: 500 },
    );
  }

  const clientSecret =
    typeof json.client_secret === "string" ? json.client_secret : undefined;
  const id = typeof json.id === "string" ? json.id : undefined;

  if (!clientSecret) {
    return NextResponse.json(
      { error: "Stripe did not return a client secret." },
      { status: 500 },
    );
  }

  return NextResponse.json({ clientSecret, id });
}
