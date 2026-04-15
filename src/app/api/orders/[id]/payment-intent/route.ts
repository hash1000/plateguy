import { NextResponse } from "next/server";
import { orders, type OrderAddress, type OrderCustomer } from "@/lib/server/orders";

export const runtime = "nodejs";

type PaymentIntentPayload = {
  customer: OrderCustomer;
  address: OrderAddress;
};

function toPence(amount: number) {
  return Math.max(0, Math.round(amount * 100));
}

function str(v: unknown) {
  return (v ?? "").toString().trim();
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 501 },
    );
  }

  const order = orders.get(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  let payload: PaymentIntentPayload;
  try {
    payload = (await req.json()) as PaymentIntentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const customer = payload?.customer;
  const address = payload?.address;
  if (!customer || !address) {
    return NextResponse.json(
      { error: "customer and address are required." },
      { status: 400 },
    );
  }

  const name = str(customer.name);
  const email = str(customer.email);
  const phone = str(customer.phone);
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing customer details." }, { status: 400 });
  }

  const address1 = str(address.address1);
  const address2 = str(address.address2);
  const city = str(address.city);
  const county = str(address.county);
  const postcode = str(address.postcode);
  const country = str(address.country) || "GB";
  if (!address1 || !city || !postcode || !country) {
    return NextResponse.json({ error: "Missing address details." }, { status: 400 });
  }

  const amount = toPence(order.subtotal);
  if (amount <= 0) {
    return NextResponse.json(
      { error: "Order total is zero; cannot create a payment." },
      { status: 400 },
    );
  }

  const paramsBody = new URLSearchParams();
  paramsBody.set("amount", amount.toString());
  paramsBody.set("currency", order.currency);
  paramsBody.set("payment_method_types[0]", "card");
  paramsBody.set("receipt_email", email);
  paramsBody.set("description", `PlateGuy order (${order.plateNumber})`);

  paramsBody.set("metadata[order_id]", order.id);
  paramsBody.set("metadata[plate_number]", order.plateNumber);
  paramsBody.set("metadata[road_legal_spacing]", order.roadLegalSpacing ? "true" : "false");

  paramsBody.set("shipping[name]", name);
  paramsBody.set("shipping[phone]", phone);
  paramsBody.set("shipping[address][line1]", address1);
  if (address2) paramsBody.set("shipping[address][line2]", address2);
  paramsBody.set("shipping[address][city]", city);
  if (county) paramsBody.set("shipping[address][state]", county);
  paramsBody.set("shipping[address][postal_code]", postcode);
  paramsBody.set("shipping[address][country]", country);

  const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: paramsBody.toString(),
  });

  const json = (await stripeRes.json()) as unknown;
  const isObject = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object" && !Array.isArray(v);

  if (!stripeRes.ok) {
    const details =
      isObject(json) && isObject(json.error) && typeof json.error.message === "string"
        ? json.error.message
        : json;
    return NextResponse.json(
      { error: "Stripe error creating payment intent.", details },
      { status: 500 },
    );
  }

  if (!isObject(json) || typeof json.client_secret !== "string" || typeof json.id !== "string") {
    return NextResponse.json(
      { error: "Stripe response was invalid." },
      { status: 500 },
    );
  }

  orders.update(order.id, {
    status: "requires_payment",
    customer: { name, email, phone },
    address: {
      address1,
      address2: address2 || undefined,
      city,
      county: county || undefined,
      postcode,
      country,
    },
    paymentIntentId: json.id,
  });

  return NextResponse.json({ clientSecret: json.client_secret, paymentIntentId: json.id });
}

