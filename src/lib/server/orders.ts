import { plateStyles } from "@/style/PlateStyles";
import type { Basket } from "@/lib/basket";
import crypto from "crypto";

export type OrderStatus = "draft" | "requires_payment" | "paid" | "cancelled";

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type OrderAddress = {
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
};

export type OrderLine = {
  side: "front" | "rear";
  title: string;
  styleName: string;
  sizeKey: string;
  borderType?: string | null;
  borderThickness?: number | null;
  gelName?: string | null;
  unitPrice: number; // GBP
};

export type Order = {
  id: string;
  plateNumber: string;
  roadLegalSpacing: boolean;
  lines: OrderLine[];
  subtotal: number; // GBP
  currency: "gbp";
  status: OrderStatus;
  customer?: OrderCustomer;
  address?: OrderAddress;
  paymentIntentId?: string;
  createdAt: number;
  updatedAt: number;
};

function lookupPrice(styleName: string, sizeKey: string, side: "front" | "rear") {
  const style = plateStyles.find((s) => s.name.trim() === styleName.trim());
  if (!style) return null;
  const sizes = side === "front" ? style.frontPlate.sizes : style.rearPlate.sizes;
  const size = sizes.find((sz) => sz.key === sizeKey);
  return size?.price ?? 0;
}

function normalizeBasket(basket: Basket) {
  const plateNumber = (basket.plateNumber ?? "").toString().trim();
  const wantFront = !!basket.wantFront;
  const wantBack = !!basket.wantBack;
  if (!plateNumber) throw new Error("plateNumber is required.");
  if (!wantFront && !wantBack) throw new Error("Select at least one plate.");
  if (wantFront && !basket.front) throw new Error("front is required.");
  if (wantBack && !basket.rear) throw new Error("rear is required.");
  return { plateNumber, wantFront, wantBack };
}

export function basketToOrderDraft(basket: Basket): Omit<Order, "id"> {
  const { plateNumber, wantFront, wantBack } = normalizeBasket(basket);

  const lines: OrderLine[] = [];

  if (wantFront && basket.front) {
    const unitPrice = lookupPrice(basket.front.styleName, basket.front.sizeKey, "front");
    if (unitPrice == null) throw new Error("Unknown front style/size selection.");
    lines.push({
      side: "front",
      title: "Front number plate",
      styleName: basket.front.styleName,
      sizeKey: basket.front.sizeKey,
      borderType: basket.front.borderType ?? null,
      borderThickness: basket.front.borderThickness ?? null,
      gelName: basket.front.gelName ?? null,
      unitPrice,
    });
  }

  if (wantBack && basket.rear) {
    const unitPrice = lookupPrice(basket.rear.styleName, basket.rear.sizeKey, "rear");
    if (unitPrice == null) throw new Error("Unknown rear style/size selection.");
    lines.push({
      side: "rear",
      title: "Rear number plate",
      styleName: basket.rear.styleName,
      sizeKey: basket.rear.sizeKey,
      borderType: basket.rear.borderType ?? null,
      borderThickness: basket.rear.borderThickness ?? null,
      gelName: basket.rear.gelName ?? null,
      unitPrice,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + (l.unitPrice ?? 0), 0);
  if (subtotal <= 0) throw new Error("Order total is zero.");

  const now = Date.now();
  return {
    plateNumber,
    roadLegalSpacing: !!basket.roadLegalSpacing,
    lines,
    subtotal,
    currency: "gbp",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

type OrderStore = {
  get(id: string): Order | undefined;
  create(draft: Omit<Order, "id">): Order;
  update(id: string, patch: Partial<Order>): Order | undefined;
};

function getStore(): Map<string, Order> {
  const key = "__plateguy_orders_store__";
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g[key]) g[key] = new Map<string, Order>();
  return g[key] as Map<string, Order>;
}

export const orders: OrderStore = {
  get(id) {
    return getStore().get(id);
  },
  create(draft) {
    const id = crypto.randomUUID();
    const order: Order = { ...draft, id };
    getStore().set(id, order);
    return order;
  },
  update(id, patch) {
    const existing = getStore().get(id);
    if (!existing) return undefined;
    const updated: Order = {
      ...existing,
      ...patch,
      id: existing.id,
      updatedAt: Date.now(),
    };
    getStore().set(id, updated);
    return updated;
  },
};

