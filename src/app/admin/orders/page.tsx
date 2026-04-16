import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const status = sp.status?.trim() || "";
  const q = sp.q?.trim() || "";

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(q
        ? {
            OR: [
              { id: { contains: q } },
              { customerEmail: { contains: q } },
              { customerName: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
    select: {
      id: true,
      customerName: true,
      totalAmount: true,
      status: true,
      createdAt: true,
    },
  });

  const statuses = ["", "pending", "paid", "shipped", "delivered", "cancelled"];

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-heading text-3xl">Orders</h1>
          <Link href="/admin" className="text-sm text-brand-yellow hover:underline">
            Dashboard
          </Link>
        </div>

        <form className="flex flex-col sm:flex-row gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by order id or customer…"
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-yellow/50"
          />
          <select
            name="status"
            defaultValue={status}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-yellow/50"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="text-black">
                {s ? s : "all statuses"}
              </option>
            ))}
          </select>
          <button className="rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity">
            Filter
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-xs text-white/60 border-b border-white/10">
            <div className="col-span-5">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-white/10">
            {orders.length === 0 ? (
              <div className="px-5 py-6 text-white/60">No orders found.</div>
            ) : (
              orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="grid grid-cols-12 px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-5 font-mono text-sm">{o.id}</div>
                  <div className="col-span-3">{o.customerName}</div>
                  <div className="col-span-2 text-right font-bold">
                    £{Number(o.totalAmount).toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right text-white/70">{o.status}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

