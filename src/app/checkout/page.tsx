"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Field } from "@/components/ui/input";
import OrderSummary from "@/components/OrderSummary";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setAddress, setContact, setStep } from "@/lib/features/checkoutSlice";
import Link from "next/link";

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);
  const step = useAppSelector((state) => state.checkout.step);
  const contact = useAppSelector((state) => state.checkout.contact);
  const address = useAppSelector((state) => state.checkout.address);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + (item.frontPrice + item.rearPrice) * item.quantity;
    }, 0);
  }, [items]);

  function validateDetails() {
    const e: Record<string, string> = {};
    if (
      !contact.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
    )
      e.email = "Enter a valid email address";
    if (!contact.firstName.trim()) e.firstName = "First name is required";
    if (!contact.lastName.trim()) e.lastName = "Last name is required";
    if (!contact.phone.trim()) e.phone = "Phone. number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateAddress() {
    const e: Record<string, string> = {};
    if (!address.line1.trim()) e.line1 = "Address line 1 is required";
    if (!address.city.trim()) e.city = "Town / City is required";
    if (!address.postcode.trim()) e.postcode = "Postcode is required";
    else if (
      !/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(address.postcode.trim())
    )
      e.postcode = "Enter a valid UK postcode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add a plate before checking out.",
        variant: "destructive",
      });
      return;
    }
    if (!validateAddress()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({
            plateNumber: item.plateNumber,
            roadLegalSpacing: item.roadLegalSpacing,
            quantity: item.quantity,
            front: item.front,
            rear: item.rear,
          })),
          customerEmail: contact.email,
          customerName: `${contact.firstName} ${contact.lastName}`,
          customerPhone: contact.phone,
          shippingAddress: {
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.county,
            postal_code: address.postcode,
            country: "GB",
          },
        }),
      });

      const data = await res.json();

      try {
        if (window.top) window.top.location.href = data.url;
        else window.location.href = data.url;
      } catch {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* LEFT */}
      <div className="lg:col-span-3 space-y-4">
        {step === "details" && (
          <>
            <Field label="Email" value={email} onChange={setEmail} errors={errors} setErrors={setErrors} />
            <Field label="First Name" value={firstName} onChange={setFirstName} errors={errors} setErrors={setErrors} />
            <Field label="Last Name" value={lastName} onChange={setLastName} errors={errors} setErrors={setErrors} />
            <Field label="Phone" value={phone} onChange={setPhone}  errors={errors} setErrors={setErrors} />

            <button
              onClick={() =>
                validateDetails() && setStep("address")
              }
              className="bg-yellow-400 w-full py-3"
            >
              Continue
            </button>
          </>
        )}

        {step === "address" && (
          <>
            <Field label="Address" value={line1} onChange={setLine1} errors={errors} setErrors={setErrors} />
            <Field label="City" value={city} onChange={setCity}  errors={errors} setErrors={setErrors} />
            <Field label="Postcode" value={postcode} onChange={setPostcode} errors={errors} setErrors={setErrors} />

            <button
              onClick={handleSubmit}
              className="bg-yellow-400 w-full py-3"
            >
              Pay £{total.toFixed(2)}
            </button>
          </>
        )}
      </div>

      {/* RIGHT → ORDER SUMMARY */}
      <div className="lg:col-span-2 bg-gray-100 p-4 rounded">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 border-b pb-2">
            <p className="font-bold">{item.plateNumber}</p>

            <p className="text-sm">
              £{(item.frontPrice + item.rearPrice).toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => dispatch(decreaseQty(item.id))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQty(item.id))}>+</button>
              <button
                onClick={() => dispatch(removeItem(item.id))}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="font-bold text-lg">
          Total: £{total.toFixed(2)}
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
                value={contact.email}
                onChange={(v: string) => dispatch(setContact({ email: v }))}
                placeholder="you@example.com"
                errors={errors}
                setErrors={setErrors}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  id="firstName"
                  value={contact.firstName}
                  onChange={(v: string) => dispatch(setContact({ firstName: v }))}
                  placeholder="John"
                  errors={errors}
                  setErrors={setErrors}
                  required
                />
                <Field
                  label="Last Name"
                  id="lastName"
                  value={contact.lastName}
                  onChange={(v: string) => dispatch(setContact({ lastName: v }))}
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
                value={contact.phone}
                onChange={(v: string) => dispatch(setContact({ phone: v }))}
                placeholder="07700 900000"
                errors={errors}
                setErrors={setErrors}
                required
              />

              <button
                onClick={() => {
                  if (validateDetails()) dispatch(setStep("address"));
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
                  onClick={() => dispatch(setStep("details"))}
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
                    {contact.firstName} {contact.lastName} · {contact.email}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setStep("details"))}
                  className="text-xs text-yellow-700 hover:underline font-medium"
                >
                  Edit
                </button>
              </div>

              <Field
                label="Address Line 1"
                id="line1"
                value={address.line1}
                onChange={(v: string) => dispatch(setAddress({ line1: v }))}
                placeholder="38 Bluebell Road"
                errors={errors}
                setErrors={setErrors}
                required
              />
              <Field
                label="Address Line 2"
                id="line2"
                value={address.line2}
                onChange={(v: string) => dispatch(setAddress({ line2: v }))}
                placeholder="Apartment, suite, etc. (optional)"
                errors={errors}
                setErrors={setErrors}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Town / City"
                  id="city"
                  value={address.city}
                  onChange={(v: string) => dispatch(setAddress({ city: v }))}
                  placeholder="Wakefield"
                  errors={errors}
                setErrors={setErrors}
                required
                />
              </div>

              <Field
                label="Postcode"
                id="postcode"
                value={address.postcode}
                onChange={(v: string) =>
                  dispatch(setAddress({ postcode: v.toUpperCase() }))
                }
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
            <Link
              href="/plate-builder"
              className="text-sm font-semibold text-yellow-700 hover:underline"
            >
              Add another plate
            </Link>
          </div>
          <OrderSummary />
        </div>
      </main>
    </div>
  );
}
