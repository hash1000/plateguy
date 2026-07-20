import {
  plateStyles,
  STANDARD_BORDERS,
} from "@/style/PlateStyles";

export interface PriceOverrideDTO {
  kind: "size" | "border";
  styleName: string; // "" for borders
  key: string; // size key or border name
  price: number;
}

/**
 * Applies admin price overrides onto the in-memory catalog
 * (plateStyles sizes + STANDARD_BORDERS). Every component reads prices
 * from these shared objects, so callers should re-render after this runs.
 */
export function applyOverridesToCatalog(overrides: PriceOverrideDTO[]) {
  for (const o of overrides) {
    if (o.kind === "border") {
      const border = STANDARD_BORDERS.find(
        (b) => b.name.trim() === o.key.trim(),
      );
      if (border) border.price = o.price;
      continue;
    }

    for (const style of plateStyles) {
      if (style.name.trim() !== o.styleName.trim()) continue;
      for (const size of [
        ...style.frontPlate.sizes,
        ...style.rearPlate.sizes,
      ]) {
        if (size.key === o.key) size.price = o.price;
      }
    }
  }
}

export interface CatalogSizeRow {
  key: string;
  price: number;
  defaultPrice: number;
  overridden: boolean;
}

export interface CatalogStyleRow {
  name: string;
  sizes: CatalogSizeRow[];
}

export interface CatalogBorderRow {
  name: string;
  price: number;
  defaultPrice: number;
  overridden: boolean;
}

/**
 * Builds the admin pricing catalog: unique styles with their size prices,
 * plus the shared border list, with overrides merged in.
 */
export function buildPricingCatalog(overrides: PriceOverrideDTO[]) {
  const sizeOverride = (styleName: string, key: string) =>
    overrides.find(
      (o) =>
        o.kind === "size" &&
        o.styleName.trim() === styleName.trim() &&
        o.key === key,
    );
  const borderOverride = (name: string) =>
    overrides.find((o) => o.kind === "border" && o.key.trim() === name.trim());

  const styles: CatalogStyleRow[] = [];
  for (const style of plateStyles) {
    const name = style.name.trim();
    let row = styles.find((s) => s.name === name);
    if (!row) {
      row = { name, sizes: [] };
      styles.push(row);
    }
    for (const size of [...style.frontPlate.sizes, ...style.rearPlate.sizes]) {
      if (row.sizes.some((s) => s.key === size.key)) continue;
      const ov = sizeOverride(name, size.key);
      row.sizes.push({
        key: size.key,
        price: ov ? ov.price : (size.price ?? 0),
        defaultPrice: size.price ?? 0,
        overridden: !!ov,
      });
    }
  }

  const borders: CatalogBorderRow[] = STANDARD_BORDERS.map((b) => {
    const ov = borderOverride(b.name);
    return {
      name: b.name,
      price: ov ? ov.price : (b.price ?? 0),
      defaultPrice: b.price ?? 0,
      overridden: !!ov,
    };
  });

  return { styles, borders };
}
