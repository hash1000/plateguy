"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Field } from "@/components/ui/input";
import OrderSummary from "@/components/OrderSummary";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckoutData {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  frontPrice: number;
  rearPrice: number;
  front?: {
    styleName: string;
    sizeKey: string;
    borderType?: string | null;
    borderThickness?: number | null;
    gelName?: string | null;
  };
  rear?: {
    styleName: string;
    sizeKey: string;
    borderType?: string | null;
    borderThickness?: number | null;
    gelName?: string | null;
  };
}


// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"details" | "address">("details");

  // Form fields
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postcode, setPostcode] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load cart data from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("plateCheckout");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setCheckoutData(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400" />
      </div>
    );
  }

  const total =
    (checkoutData.wantFront ? checkoutData.frontPrice : 0) +
    (checkoutData.wantBack ? checkoutData.rearPrice : 0);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateDetails() {
    const e: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!phone.trim()) e.phone = "Phone. number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateAddress() {
    const e: Record<string, string> = {};
    if (!line1.trim()) e.line1 = "Address line 1 is required";
    if (!city.trim()) e.city = "Town / City is required";
    if (!postcode.trim()) e.postcode = "Postcode is required";
    else if (
      !/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode.trim())
    )
      e.postcode = "Enter a valid UK postcode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validateAddress()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkoutData,
          customerEmail: email,
          customerName: `${firstName} ${lastName}`,
          customerPhone: phone,
          shippingAddress: {
            line1,
            line2: line2 || null,
            city,
            state: county,
            postal_code: postcode,
            country: "GB",
          },
        }),
      });

      if (res.status === 501) {
        toast({
          title: "Stripe not configured",
          description: "STRIPE_SECRET_KEY is not set.",
          variant: "destructive",
        });
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({
          title: "Checkout error",
          description: err?.error ?? "Failed to start checkout.",
          variant: "destructive",
        });
        return;
      }

      const data = await res.json();
      if (!data.url) {
        toast({
          title: "Checkout error",
          description: "Stripe checkout URL was missing.",
          variant: "destructive",
        });
        return;
      }

      sessionStorage.removeItem("plateCheckout");

      try {
        if (window.top) window.top.location.href = data.url;
        else window.location.href = data.url;
      } catch {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast({
        title: "Checkout error",
        description: e?.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition"
        >
          ← Back
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            {["details", "address", "payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${(step === "details" && i === 0) ||
                      (step === "address" && i <= 1)
                      ? "bg-yellow-400 text-black"
                      : i === 2
                        ? "bg-gray-100 text-gray-400"
                        : "bg-green-500 text-white"
                    }`}
                >
                  {(step === "address" && i === 0) ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-medium capitalize hidden sm:block ${(step === "details" && i === 0) ||
                      (step === "address" && i === 1)
                      ? "text-gray-900"
                      : "text-gray-400"
                    }`}
                >
                  {s}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
        <div className="w-20" />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: Form ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* ── Step 1: Contact details ──────────────────────────────────── */}
          {step === "details" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Contact Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  We'll send your order confirmation here.
                </p>
              </div>

              <Field
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                errors={errors}
                setErrors={setErrors}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  id="firstName"
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="John"
                  errors={errors}
                  setErrors={setErrors}
                  required
                />
                <Field
                  label="Last Name"
                  id="lastName"
                  value={lastName}
                  onChange={setLastName}
                  placeholder="Smith"
                  errors={errors}
                  setErrors={setErrors}
                  required
                />
              </div>

              <Field
                label="Phone Number"
                id="phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="07700 900000"
                errors={errors}
                setErrors={setErrors}
                required
              />

              <button
                onClick={() => {
                  if (validateDetails()) setStep("address");
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 rounded-lg transition text-sm tracking-wide"
              >
                Continue to Address →
              </button>
            </div>
          )}

          {/* ── Step 2: Delivery address ──────────────────────────────────── */}
          {step === "address" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("details")}
                  className="text-gray-400 hover:text-gray-700 transition text-sm"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">
                    Delivery Address
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    UK deliveries only. Plates shipped within 2–3 business days.
                  </p>
                </div>
              </div>

              {/* Email summary pill */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {firstName} {lastName} · {email}
                  </p>
                </div>
                <button
                  onClick={() => setStep("details")}
                  className="text-xs text-yellow-700 hover:underline font-medium"
                >
                  Edit
                </button>
              </div>

              <Field
                label="Address Line 1"
                id="line1"
                value={line1}
                onChange={setLine1}
                placeholder="38 Bluebell Road"
                errors={errors}
                setErrors={setErrors}
                required
              />
              <Field
                label="Address Line 2"
                id="line2"
                value={line2}
                onChange={setLine2}
                placeholder="Apartment, suite, etc. (optional)"
                errors={errors}
                setErrors={setErrors}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Town / City"
                  id="city"
                  value={city}
                  onChange={setCity}
                  placeholder="Wakefield"
                  errors={errors}
                setErrors={setErrors}
                required
                />
              </div>

              <Field
                label="Postcode"
                id="postcode"
                value={postcode}
                onChange={(v: any) => setPostcode(v.toUpperCase())}
                placeholder="WF3 2LS"
                errors={errors}
                setErrors={setErrors}
                required
              />



              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-lg transition text-sm tracking-wide flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Redirecting to payment…
                  </>
                ) : (
                  <>Pay £{total.toFixed(2)} securely →</>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                🔒 Your payment is processed securely by Stripe. We never store
                card details.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ──────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </main>
    </div>
  );
}