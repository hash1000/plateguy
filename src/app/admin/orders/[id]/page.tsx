import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderActions from "./OrderActions";

export const runtime = "nodejs";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-brand-dark text-white">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="font-heading text-3xl mb-3">Order not found</h1>
          <Link href="/admin/orders" className="text-brand-yellow hover:underline">
            Back to orders
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl">Order</h1>
            <p className="text-white/60 font-mono text-sm mt-1">{order.id}</p>
          </div>
          <Link href="/admin/orders" className="text-sm text-brand-yellow hover:underline">
            Back to orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-bold mb-3">Customer</h2>
              <div className="text-sm text-white/80 space-y-1">
                <p>
                  <span className="text-white/60">Name:</span> {order.customerName}
                </p>
                <p>
                  <span className="text-white/60">Email:</span> {order.customerEmail}
                </p>
                <p>
                  <span className="text-white/60">Phone:</span> {order.customerPhone}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-bold mb-3">Shipping</h2>
              <div className="text-sm text-white/80 space-y-1">
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 ? <p>{order.shippingLine2}</p> : null}
                <p>
                  {order.shippingCity}
                  {order.shippingCounty ? `, ${order.shippingCounty}` : ""}{" "}
                  {order.shippingPostcode}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-bold">Items</h2>
                <p className="font-bold">£{Number(order.totalAmount).toFixed(2)}</p>
              </div>
              <div className="divide-y divide-white/10">
                {order.items.map((it) => (
                  <div key={it.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{it.plateNumber}</p>
                        <p className="text-sm text-white/60">
                          Front: {it.frontStyle ?? "—"} (£{Number(it.frontPrice).toFixed(2)}) · Rear:{" "}
                          {it.rearStyle ?? "—"} (£{Number(it.rearPrice).toFixed(2)})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Qty</p>
                        <p className="font-bold">{it.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-1">
              <p className="text-sm text-white/60">Status</p>
              <p className="text-xl font-black">{order.status}</p>
              <p className="text-sm text-white/60">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <OrderActions orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </section>
    </main>
  );
}

