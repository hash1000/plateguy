"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Field } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import {
  removeItem,
  increaseQty,
  decreaseQty,
  clearCart,
} from "@/lib/features/cartSlice";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"details" | "address">(
    "details"
  );

  // form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>(
    {}
  );

  // 🔥 redirect if cart empty
  if (!cartItems.length) {
    router.replace("/");
    return null;
  }

  const total = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.frontPrice + item.rearPrice) *
        item.quantity),
    0
  );

  function validateDetails() {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email required";
    if (!firstName) e.firstName = "Required";
    if (!lastName) e.lastName = "Required";
    if (!phone) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: cartItems,
          total,
          customer: {
            email,
            name: `${firstName} ${lastName}`,
            phone,
          },
          address: {
            line1,
            city,
            postcode,
          },
        }),
      });

      const data = await res.json();

      dispatch(clearCart());

      window.location.href = data.url;
    } catch (err: any) {
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
      </div>
    </div>
  );
}