"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { plateSizeLabel } from "@/lib/utils";
import type {
  CatalogBorderRow,
  CatalogStyleRow,
  PriceOverrideDTO,
} from "@/lib/pricing";

interface Catalog {
  styles: CatalogStyleRow[];
  borders: CatalogBorderRow[];
}

type EditMap = Record<string, string>; // rowId -> input value

const rowId = (kind: "size" | "border", styleName: string, key: string) =>
  `${kind}|${styleName}|${key}`;

function PriceInput({
  value,
  changed,
  onChange,
}: {
  value: string;
  changed: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
        £
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-28 rounded-lg border bg-white/10 py-1.5 pl-7 pr-2 text-right font-semibold outline-none transition focus:border-brand-yellow ${
          changed ? "border-brand-yellow" : "border-white/15"
        }`}
      />
    </div>
  );
}

export default function AdminPricingPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [edits, setEdits] = useState<EditMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCatalog((await res.json()) as Catalog);
      setEdits({});
    } catch {
      setMessage({ kind: "error", text: "Failed to load pricing." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const currentValue = (
    kind: "size" | "border",
    styleName: string,
    key: string,
    saved: number,
  ) => {
    const id = rowId(kind, styleName, key);
    return id in edits ? edits[id] : saved.toFixed(2);
  };

  const setValue = (
    kind: "size" | "border",
    styleName: string,
    key: string,
    value: string,
  ) => {
    setEdits((prev) => ({ ...prev, [rowId(kind, styleName, key)]: value }));
  };

  // Rows whose input differs from the saved price
  const changes = useMemo(() => {
    if (!catalog) return [];
    const list: {
      kind: "size" | "border";
      styleName: string;
      key: string;
      price: number;
      defaultPrice: number;
    }[] = [];

    const collect = (
      kind: "size" | "border",
      styleName: string,
      key: string,
      saved: number,
      defaultPrice: number,
    ) => {
      const id = rowId(kind, styleName, key);
      if (!(id in edits)) return;
      const parsed = parseFloat(edits[id]);
      if (!Number.isFinite(parsed) || parsed < 0) return;
      if (Math.abs(parsed - saved) < 0.005) return;
      list.push({ kind, styleName, key, price: parsed, defaultPrice });
    };

    for (const style of catalog.styles) {
      for (const size of style.sizes) {
        collect("size", style.name, size.key, size.price, size.defaultPrice);
      }
    }
    for (const border of catalog.borders) {
      collect("border", "", border.name, border.price, border.defaultPrice);
    }
    return list;
  }, [catalog, edits]);

  async function saveChanges() {
    if (changes.length === 0) return;
    setSaving(true);
    setMessage(null);

    const upserts: PriceOverrideDTO[] = [];
    const deletes: Omit<PriceOverrideDTO, "price">[] = [];
    for (const c of changes) {
      if (Math.abs(c.price - c.defaultPrice) < 0.005) {
        deletes.push({ kind: c.kind, styleName: c.styleName, key: c.key });
      } else {
        upserts.push({
          kind: c.kind,
          styleName: c.styleName,
          key: c.key,
          price: Math.round(c.price * 100) / 100,
        });
      }
    }

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upserts, deletes }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({
        kind: "ok",
        text: `Saved ${changes.length} price change${changes.length === 1 ? "" : "s"}.`,
      });
      await load();
    } catch {
      setMessage({ kind: "error", text: "Saving failed. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function resetRow(
    kind: "size" | "border",
    styleName: string,
    key: string,
    defaultPrice: number,
  ) {
    setValue(kind, styleName, key, defaultPrice.toFixed(2));
  }

  return (
    <main className="min-h-[70vh] bg-brand-dark text-white">
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl">Plate pricing</h1>
            <p className="mt-1 text-sm text-white/60">
              Edit style, size and border prices. Changes go live in the plate
              builder immediately.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-white/15 px-4 py-2 font-bold text-white/80 transition-colors hover:bg-white/5"
            >
              Dashboard
            </Link>
            <button
              onClick={saveChanges}
              disabled={saving || changes.length === 0}
              className="rounded-xl bg-brand-yellow px-5 py-2 font-bold text-brand-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Saving…"
                : changes.length > 0
                  ? `Save ${changes.length} change${changes.length === 1 ? "" : "s"}`
                  : "Save changes"}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              message.kind === "ok"
                ? "border-green-500/40 bg-green-500/10 text-green-300"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading || !catalog ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-10 text-center text-white/60">
            Loading pricing…
          </div>
        ) : (
          <>
            {/* Borders */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="font-bold">Borders</h2>
                <p className="text-sm text-white/60">
                  Shared across all plate styles.
                </p>
              </div>
              <div className="divide-y divide-white/10">
                {catalog.borders.map((border) => {
                  const value = currentValue(
                    "border",
                    "",
                    border.name,
                    border.price,
                  );
                  const changed =
                    Math.abs(parseFloat(value || "0") - border.price) >= 0.005;
                  return (
                    <div
                      key={border.name}
                      className="flex items-center justify-between gap-4 px-5 py-3"
                    >
                      <div>
                        <p className="font-semibold">{border.name}</p>
                        <p className="text-xs text-white/50">
                          Default £{border.defaultPrice.toFixed(2)}
                          {border.overridden && " · overridden"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {parseFloat(value || "0") !== border.defaultPrice && (
                          <button
                            onClick={() =>
                              resetRow("border", "", border.name, border.defaultPrice)
                            }
                            className="text-xs font-semibold text-brand-yellow hover:underline"
                          >
                            Reset
                          </button>
                        )}
                        <PriceInput
                          value={value}
                          changed={changed}
                          onChange={(v) => setValue("border", "", border.name, v)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Styles */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {catalog.styles.map((style) => (
                <div
                  key={style.name}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-bold">{style.name}</h2>
                  </div>
                  <div className="divide-y divide-white/10">
                    {style.sizes.map((size) => {
                      const value = currentValue(
                        "size",
                        style.name,
                        size.key,
                        size.price,
                      );
                      const changed =
                        Math.abs(parseFloat(value || "0") - size.price) >=
                        0.005;
                      return (
                        <div
                          key={size.key}
                          className="flex items-center justify-between gap-4 px-5 py-3"
                        >
                          <div>
                            <p className="font-semibold">
                              {plateSizeLabel(size.key)}
                            </p>
                            <p className="text-xs text-white/50">
                              Default £{size.defaultPrice.toFixed(2)}
                              {size.overridden && " · overridden"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {parseFloat(value || "0") !== size.defaultPrice && (
                              <button
                                onClick={() =>
                                  resetRow(
                                    "size",
                                    style.name,
                                    size.key,
                                    size.defaultPrice,
                                  )
                                }
                                className="text-xs font-semibold text-brand-yellow hover:underline"
                              >
                                Reset
                              </button>
                            )}
                            <PriceInput
                              value={value}
                              changed={changed}
                              onChange={(v) =>
                                setValue("size", style.name, size.key, v)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
