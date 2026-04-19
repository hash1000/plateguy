import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status")?.trim() || null;
  const q = searchParams.get("q")?.trim() || null;
  const allowed: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
  const statusFilter = status && allowed.includes(status as OrderStatus) ? (status as OrderStatus) : null;

  const orders = await prisma.order.findMany({ 
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
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
    take: 200,
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      totalAmount: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ orders });
}

