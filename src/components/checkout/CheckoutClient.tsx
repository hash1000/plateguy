"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { Basket, clearBasket, loadBasket } from "@/lib/basket";
import { clearCurrentOrderId, loadCurrentOrderId } from "@/lib/orderClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
};

type Order = {
  id: string;
  plateNumber: string;
  roadLegalSpacing: boolean;
  lines: Array<{
    side: "front" | "rear";
    title: string;
    styleName: string;
    sizeKey: string;
    borderType?: string | null;
    borderThickness?: number | null;
    gelName?: string | null;
    unitPrice: number;
  }>;
  subtotal: number;
  currency: "gbp";
  status: "draft" | "requires_payment" | "paid" | "cancelled";
  paymentIntentId?: string;
};

function formatGBP(amount: number) {
  return `£${amount.toFixed(2)}`;
}

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

function CheckoutInner({ order }: { order: Order }) {
  const router = useRouter();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const [isPaying, setIsPaying] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    county: "",
    postcode: "",
    country: "GB",
  });

  const total = useMemo(() => order.subtotal ?? 0, [order.subtotal]);

  const canPay =
    !!stripe &&
    !!elements &&
    total > 0 &&
    !!customer.name.trim() &&
    !!customer.email.trim() &&
    !!customer.phone.trim() &&
    !!customer.address1.trim() &&
    !!customer.city.trim() &&
    !!customer.postcode.trim() &&
    !!customer.country.trim();

  async function handlePay() {
    if (isPaying) return;
    if (!stripe || !elements) return;

    setIsPaying(true);
    try {
      const card = elements.getElement(CardElement);
      if (!card) {
        toast({
          title: "Payment error",
          description: "Card input was not ready yet.",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(`/api/orders/${order.id}/payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: customer.name, email: customer.email, phone: customer.phone },
          address: {
            address1: customer.address1,
            address2: customer.address2,
            city: customer.city,
            county: customer.county,
            postcode: customer.postcode,
            country: customer.country,
          },
        }),
      });

      if (res.status === 501) {
        toast({
          title: "Stripe not configured",
          description:
            "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card payments.",
          variant: "destructive",
        });
        return;
      }

      const json = (await res.json().catch(() => ({}))) as {
        clientSecret?: string;
        paymentIntentId?: string;
        error?: string;
      };

      if (!res.ok || !json.clientSecret) {
        toast({
          title: "Payment error",
          description: json?.error ?? "Failed to start payment.",
          variant: "destructive",
        });
        return;
      }

      const result = await stripe.confirmCardPayment(json.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: {
              line1: customer.address1,
              line2: customer.address2 || undefined,
              city: customer.city,
              state: customer.county || undefined,
              postal_code: customer.postcode,
              country: customer.country,
            },
          },
        },
      });

      if (result.error) {
        toast({
          title: "Payment failed",
          description: result.error.message ?? "Payment failed.",
          variant: "destructive",
        });
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await fetch(`/api/orders/${order.id}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
        }).catch(() => {});

        clearBasket();
        clearCurrentOrderId();
        router.push(
          `/checkout/success?order_id=${encodeURIComponent(
            order.id,
          )}&payment_intent=${encodeURIComponent(result.paymentIntent.id)}`,
        );
        return;
      }

      toast({
        title: "Payment pending",
        description:
          "Your payment needs additional confirmation. Please follow the instructions from your bank and try again if needed.",
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Payment failed.";
      toast({
        title: "Payment error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl">Checkout</h1>
            <p className="text-white/70 mt-2">
              Enter your delivery details and pay securely by card.
            </p>
          </div>
          <a
            href="/plate-builder"
            className="hidden sm:inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10 transition-colors"
          >
            Edit order
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-heading text-xl mb-4">Contact information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/70 mb-1">Full name</label>
                  <Input
                    value={customer.name}
                    onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                    placeholder="John Smith"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Email</label>
                  <Input
                    value={customer.email}
                    onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                    placeholder="you@example.com"
                    type="email"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Phone</label>
                  <Input
                    value={customer.phone}
                    onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="07..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-heading text-xl mb-4">Delivery address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/70 mb-1">Address line 1</label>
                  <Input
                    value={customer.address1}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, address1: e.target.value }))
                    }
                    placeholder="House number and street"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/70 mb-1">
                    Address line 2 (optional)
                  </label>
                  <Input
                    value={customer.address2}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, address2: e.target.value }))
                    }
                    placeholder="Apartment, suite, etc."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">City</label>
                  <Input
                    value={customer.city}
                    onChange={(e) => setCustomer((c) => ({ ...c, city: e.target.value }))}
                    placeholder="Leeds"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    County (optional)
                  </label>
                  <Input
                    value={customer.county}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, county: e.target.value }))
                    }
                    placeholder="West Yorkshire"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Postcode</label>
                  <Input
                    value={customer.postcode}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, postcode: e.target.value }))
                    }
                    placeholder="LS1 1AA"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Country</label>
                  <select
                    value={customer.country}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, country: e.target.value }))
                    }
                    className="h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                  >
                    <option value="GB">United Kingdom</option>
                    <option value="IE">Ireland</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-heading text-xl mb-4">Card payment</h2>
              <div className="rounded-xl border border-white/10 bg-brand-black/30 px-4 py-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: "#ffffff",
                        fontSize: "16px",
                        "::placeholder": { color: "rgba(255,255,255,0.4)" },
                      },
                      invalid: { color: "#fca5a5" },
                    },
                  }}
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handlePay}
                  disabled={!canPay || isPaying}
                  className="bg-brand-yellow text-brand-black hover:opacity-90"
                >
                  {isPaying ? "Processing…" : `Pay ${formatGBP(total)}`}
                </Button>
                <a
                  href="/plate-builder"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 transition-colors sm:hidden"
                >
                  Edit order
                </a>
              </div>

              {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                <p className="text-sm text-red-200/90 mt-3">
                  Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — card form will not work
                  until it is set.
                </p>
              ) : null}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sticky top-6">
              <h2 className="font-heading text-xl mb-4">Order summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Registration</span>
                  <span className="font-mono text-white/90">{order.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Spacing</span>
                  <span className="text-white/90">
                    {order.roadLegalSpacing ? "Road legal" : "Not road legal"}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="space-y-4 text-sm">
                {order.lines.map((line) => (
                  <div key={`${line.side}:${line.styleName}:${line.sizeKey}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold">{line.side === "front" ? "Front plate" : "Rear plate"}</p>
                        <p className="text-white/70">
                          {line.styleName} • {line.sizeKey}
                        </p>
                        {line.borderType ? (
                          <p className="text-white/70">
                            Border: {line.borderType}
                            {line.borderThickness ? ` (${line.borderThickness}mm)` : ""}
                          </p>
                        ) : null}
                        {line.gelName ? (
                          <p className="text-white/70">Gel: {line.gelName}</p>
                        ) : null}
                      </div>
                      <p className="font-bold">{formatGBP(line.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatGBP(total)}</span>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Prices are calculated server-side.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  useEffect(() => {
    const b = loadBasket();
    setBasket(b);

    const orderId = loadCurrentOrderId();
    if (!orderId) {
      setIsLoadingOrder(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then(async (r) => {
        const json = (await r.json().catch(() => ({}))) as { order?: Order };
        if (r.ok && json.order) setOrder(json.order);
      })
      .finally(() => setIsLoadingOrder(false));
  }, []);

  if (isLoadingOrder) {
    return (
      <main className="min-h-[70vh] bg-brand-dark text-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="font-heading text-4xl mb-3">Loading checkout…</h1>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-brand-dark text-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="font-heading text-4xl mb-3">Your basket is empty</h1>
          <p className="text-white/70">
            Go back to the plate builder to create your order.
          </p>
          <div className="mt-8 flex gap-3">
            <Button
              onClick={() => router.push("/plate-builder")}
              className="bg-brand-yellow text-brand-black hover:opacity-90"
            >
              Return to builder
            </Button>
          </div>
          {basket ? (
            <p className="text-sm text-white/60 mt-6">
              Note: a local basket exists, but the server order was not found. Please add
              to basket again.
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: "en-GB",
        appearance: { theme: "stripe" },
      }}
    >
      <CheckoutInner order={order} />
    </Elements>
  );
}
