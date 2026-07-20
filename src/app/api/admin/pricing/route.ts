import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { buildPricingCatalog, PriceOverrideDTO } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: catalog (styles/sizes/borders) with overrides merged in
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.priceOverride.findMany();
  const overrides: PriceOverrideDTO[] = rows.map((r) => ({
    kind: r.kind as PriceOverrideDTO["kind"],
    styleName: r.styleName,
    key: r.key,
    price: Number(r.price),
  }));

  return NextResponse.json(buildPricingCatalog(overrides));
}

interface SaveBody {
  upserts?: PriceOverrideDTO[];
  deletes?: Omit<PriceOverrideDTO, "price">[];
}

function isValidRef(o: {
  kind?: string;
  styleName?: unknown;
  key?: unknown;
}): boolean {
  return (
    (o.kind === "size" || o.kind === "border") &&
    typeof o.styleName === "string" &&
    typeof o.key === "string" &&
    (o.key as string).length > 0
  );
}

// Admin: save price changes (upsert overrides / delete = reset to default)
export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = (await req.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const upserts = (body.upserts ?? []).filter(
    (o) =>
      isValidRef(o) &&
      typeof o.price === "number" &&
      Number.isFinite(o.price) &&
      o.price >= 0 &&
      o.price <= 10000,
  );
  const deletes = (body.deletes ?? []).filter(isValidRef);

  await prisma.$transaction([
    ...deletes.map((o) =>
      prisma.priceOverride.deleteMany({
        where: { kind: o.kind, styleName: o.styleName, key: o.key },
      }),
    ),
    ...upserts.map((o) =>
      prisma.priceOverride.upsert({
        where: {
          kind_styleName_key: {
            kind: o.kind,
            styleName: o.styleName,
            key: o.key,
          },
        },
        create: {
          kind: o.kind,
          styleName: o.styleName,
          key: o.key,
          price: o.price,
        },
        update: { price: o.price },
      }),
    ),
  ]);

  return NextResponse.json({
    ok: true,
    saved: upserts.length,
    reset: deletes.length,
  });
}
