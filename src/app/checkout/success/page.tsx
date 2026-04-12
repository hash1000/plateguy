export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string } | Promise<{ session_id?: string }>;
}) {
  const { session_id } = await Promise.resolve(searchParams);

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl mb-3">Payment successful</h1>
        <p className="text-white/70">
          Thanks — your order has been received.
          {/* {session_id ? (
            <>
              {" "}
              <span className="text-white/40">Session:</span>{" "}
              <span className="font-mono text-white/80">{session_id}</span>
            </>
          ) : null} */}
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="/plate-builder"
            className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity"
          >
            Build another plate
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 transition-colors"
          >
            Back to home
          </a>
        </div>
      </section>
    </main>
  );
}
