import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type AllowedStatus = (typeof allowed)[number];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const obj = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const status = typeof obj.status === "string" ? obj.status.trim() : "";
  if (!allowed.includes(status as AllowedStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as AllowedStatus },
  });

  return NextResponse.json({ order });
}

