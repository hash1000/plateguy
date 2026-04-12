export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl mb-3">Checkout cancelled</h1>
        <p className="text-white/70">
          No payment was taken. You can go back to the builder and try again.
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="/plate-builder"
            className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity"
          >
            Return to builder
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

