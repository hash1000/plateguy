import Link from "next/link";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams?: Promise<{ order_id?: string }>;
}) {
  const { order_id } = searchParams ? await searchParams : {};

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl mb-3">Checkout cancelled</h1>
        <p className="text-white/70">
          No payment was taken. You can go back to the builder and try again.
        </p>
        {order_id ? (
          <p className="text-white/50 text-sm mt-2">
            Order: <span className="font-mono">{order_id}</span>
          </p>
        ) : null}
        <div className="mt-8 flex gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity"
          >
            Back to cart
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

