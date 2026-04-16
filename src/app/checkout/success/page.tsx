"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { clearCart } from "@/lib/features/cartSlice";
import { resetCheckout } from "@/lib/features/checkoutSlice";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    dispatch(clearCart());
    dispatch(resetCheckout());
  }, [dispatch]);

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl mb-3">Payment successful</h1>
        <p className="text-white/70">
          Thanks — your order has been received.
          {sessionId ? (
            <>
              {" "}
              <span className="text-white/40">Session:</span>{" "}
              <span className="font-mono text-white/80">{sessionId}</span>
            </>
          ) : null}
          {orderId ? (
            <>
              {" "}
              <span className="text-white/40">Order:</span>{" "}
              <span className="font-mono text-white/80">{orderId}</span>
            </>
          ) : null}
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/plate-builder"
            className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity"
          >
            Build another plate
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
