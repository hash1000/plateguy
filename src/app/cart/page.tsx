"use client";

import Link from "next/link";
import OrderSummary from "@/components/OrderSummary";
import { useAppSelector } from "@/hooks/redux";

export default function CartPage() {
  const hasItems = useAppSelector((state) => state.cart.items.length > 0);

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-heading text-3xl">Your cart</h1>
          <div className="flex gap-3">
            <Link
              href="/plate-builder"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10 transition-colors"
            >
              Continue shopping
            </Link>
            <Link
              href="/checkout"
              className={`inline-flex items-center justify-center rounded-xl bg-brand-yellow px-4 py-2 font-bold text-brand-black hover:opacity-90 transition-opacity ${
                !hasItems ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Checkout
            </Link>
          </div>
        </div>

        <OrderSummary />
      </section>
    </main>
  );
}

