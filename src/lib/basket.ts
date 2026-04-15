export type BasketPlateSide = {
  styleName: string;
  sizeKey: string;
  borderType?: string | null;
  borderThickness?: number | null;
  gelName?: string | null;
};

export type Basket = {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  front?: BasketPlateSide;
  rear?: BasketPlateSide;
  createdAt: number;
};

const STORAGE_KEY = "plateguy:basket:v1";

export function saveBasket(basket: Omit<Basket, "createdAt">) {
  if (typeof window === "undefined") return;
  const payload: Basket = { ...basket, createdAt: Date.now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearBasket() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function readSide(side: unknown): BasketPlateSide | undefined {
  if (!isObject(side)) return undefined;
  const styleName = typeof side.styleName === "string" ? side.styleName : "";
  const sizeKey = typeof side.sizeKey === "string" ? side.sizeKey : "";
  if (!styleName || !sizeKey) return undefined;

  return {
    styleName,
    sizeKey,
    borderType: typeof side.borderType === "string" ? side.borderType : null,
    borderThickness:
      typeof side.borderThickness === "number" ? side.borderThickness : null,
    gelName: typeof side.gelName === "string" ? side.gelName : null,
  };
}

export function loadBasket(): Basket | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;

    const plateNumber =
      typeof parsed.plateNumber === "string" ? parsed.plateNumber : "";
    if (!plateNumber) return null;

    const wantFront = !!parsed.wantFront;
    const wantBack = !!parsed.wantBack;
    if (!wantFront && !wantBack) return null;

    const createdAt =
      typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now();

    return {
      plateNumber,
      roadLegalSpacing: !!parsed.roadLegalSpacing,
      wantFront,
      wantBack,
      front: wantFront ? readSide(parsed.front) : undefined,
      rear: wantBack ? readSide(parsed.rear) : undefined,
      createdAt,
    };
  } catch {
    return null;
  }
}

