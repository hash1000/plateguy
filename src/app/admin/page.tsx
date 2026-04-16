import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminRecentOrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: unknown;
  status: string;
  createdAt: Date;
};

export default async function AdminDashboardPage() {
  const [totalOrders, pendingOrders, totalRevenueAgg, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.aggregate({
        where: { status: { in: ["paid", "shipped", "delivered"] } },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const totalRevenue = totalRevenueAgg._sum.totalAmount ?? 0;

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-heading text-3xl">Admin dashboard</h1>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-4 py-2 font-bold text-brand-black hover:opacity-90 transition-opacity"
          >
            View orders
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Total orders</p>
            <p className="text-3xl font-black mt-1">{totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Pending orders</p>
            <p className="text-3xl font-black mt-1">{pendingOrders}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Total revenue</p>
            <p className="text-3xl font-black mt-1">£{Number(totalRevenue).toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-yellow hover:underline">
              All orders
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-6 text-white/60">No orders yet.</div>
            ) : (
              (recentOrders as AdminRecentOrderRow[]).map((o: AdminRecentOrderRow) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="block px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{o.customerName}</p>
                      <p className="text-sm text-white/60">{o.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">£{Number(o.totalAmount).toFixed(2)}</p>
                      <p className="text-sm text-white/60">{o.status}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
