import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalOrders, pendingOrders, paidOrders, totalRevenueAgg, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "paid" } }),
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

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    paidOrders,
    totalRevenue: totalRevenueAgg._sum.totalAmount ?? 0,
    recentOrders,
  });
}

