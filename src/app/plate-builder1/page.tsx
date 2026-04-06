"use client";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type TabId = "start" | "style" | "sizing" | "border" | "finish";

interface PlateConfig {
  registration: string;
  legalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  style: string | null;
  frontSize: string | null;
  backSize: string | null;
  border: string | null;
  badge: string | null;
}

// ─── Static data ─────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "style", label: "Style" },
  { id: "sizing", label: "Sizing" },
  { id: "border", label: "Border" },
  { id: "finish", label: "Finish" },
];

const STYLES = [
  { id: "4d-3mm", label: "4D Acrylic 3mm", img: "/styles/4d-3mm.png" },
  { id: "4d-5mm", label: "4D Acrylic 5mm", img: "/styles/4d-5mm.png" },
  { id: "4d-neon", label: "4D Neon Acrylic", img: "/styles/neon.png" },
  { id: "standard", label: "Standard", img: "/styles/std.png" },
];

const SIZES = {
  front: [
    { id: "14x4.5", label: '14"–14x4.5' },
    { id: "16x4.5", label: '16"–16x4.5' },
    { id: "18x4.5", label: '18"–18x4.5' },
    { id: "20.5x4.5", label: "standard–20.5x4.5" },
  ],
  back: [
    { id: "14x4.5", label: '14"–14x4.5' },
    { id: "20.5x4.5", label: "standard–20.5x4.5" },
  ],
};

const BORDERS = [
  { id: "none", label: "No border", img: "/borders/none.png" },
  { id: "yellow", label: "Yellow border", img: "/borders/yellow.png" },
  { id: "black", label: "Black border", img: "/borders/black.png" },
];

// ─── Sub-panels ──────────────────────────────────────────────────────────────

/** START panel – registration inputs + toggles */
function StartPanel({
  config,
  onChange,
}: {
  config: PlateConfig;
  onChange: (patch: Partial<PlateConfig>) => void;
}) {
  return (
    <div className="bg-brand-yellow rounded-2xl p-6 space-y-5 text-brand-black">
      <div>
        <p className="mt-1 text-xs text-black/60">
          Formatted as <strong>{config.registration || "—"}</strong>
        </p>
      </div>

      <Toggle
        label="Use road legal spacing"
        heading="Character Spacing"
        checked={config.legalSpacing}
        onChange={(v) => onChange({ legalSpacing: v })}
      />
      <Toggle
        label="I want front plate"
        heading="FrontPlate"
        checked={config.wantFront}
        onChange={(v) => onChange({ wantFront: v })}
      />
      <Toggle
        label="I want back plate"
        heading="Back Plate"
        checked={config.wantBack}
        onChange={(v) => onChange({ wantBack: v })}
      />
    </div>
  );
}

/** STYLE panel – scrollable image card list */
function StylePanel({
  config,
  onChange,
}: {
  config: PlateConfig;
  onChange: (patch: Partial<PlateConfig>) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-3">
        Style
      </p>
      <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange({ style: s.id })}
            className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
              config.style === s.id
                ? "border-brand-yellow bg-brand-yellow/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            {/* Replace img with your actual <Image /> */}
            <div className="h-20 rounded-lg bg-white/10 flex items-center justify-center text-white/30 text-xs mb-2">
              {s.label} preview
            </div>
            <p className="text-sm text-white font-medium">{s.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/** SIZING panel – front/back sub-tabs + size chips */
function SizingPanel({
  config,
  onChange,
}: {
  config: PlateConfig;
  onChange: (patch: Partial<PlateConfig>) => void;
}) {
  const [face, setFace] = useState<"front" | "back">("front");
  const sizes = face === "front" ? SIZES.front : SIZES.back;
  const activeSize = face === "front" ? config.frontSize : config.backSize;

  return (
    <div className="space-y-4">
      {/* Front / Back sub-tab */}
      <div className="flex gap-2">
        {(["front", "back"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFace(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              face === f
                ? "bg-brand-yellow text-brand-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {f} style
          </button>
        ))}
      </div>

      {/* Style preview card */}
      <div className="rounded-xl bg-white/10 h-36 flex items-center justify-center text-white/30 text-sm">
        {config.style ?? "No style selected"}
      </div>

      {/* Size chips */}
      <div className="flex flex-wrap gap-2">
        {sizes.map((sz) => (
          <button
            key={sz.id}
            onClick={() =>
              onChange(
                face === "front" ? { frontSize: sz.id } : { backSize: sz.id },
              )
            }
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              activeSize === sz.id
                ? "border-brand-yellow bg-brand-yellow text-brand-black"
                : "border-white/20 text-white/70 hover:border-white/50"
            }`}
          >
            {sz.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** BORDER panel – scrollable image card list (same pattern as Style) */
function BorderPanel({
  config,
  onChange,
}: {
  config: PlateConfig;
  onChange: (patch: Partial<PlateConfig>) => void;
}) {
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["front", "back"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFace(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              face === f
                ? "bg-brand-yellow text-brand-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {f} style
          </button>
        ))}
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
        {BORDERS.map((b) => (
          <button
            key={b.id}
            onClick={() => onChange({ border: b.id })}
            className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
              config.border === b.id
                ? "border-brand-yellow bg-brand-yellow/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <div className="h-20 rounded-lg bg-white/10 flex items-center justify-center text-white/30 text-xs mb-2">
              {b.label} preview
            </div>
            <p className="text-sm text-white font-medium">{b.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/** FINISH panel – review + add to cart */
function FinishPanel({ config }: { config: PlateConfig }) {
  return (
    <div className="space-y-4 text-white">
      <p className="text-brand-yellow text-xs font-bold uppercase tracking-widest">
        Review your order
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="text-white/50">Registration:</span>{" "}
          {config.registration || "—"}
        </li>
        <li>
          <span className="text-white/50">Style:</span> {config.style || "—"}
        </li>
        <li>
          <span className="text-white/50">Front size:</span>{" "}
          {config.frontSize || "—"}
        </li>
        <li>
          <span className="text-white/50">Back size:</span>{" "}
          {config.backSize || "—"}
        </li>
        <li>
          <span className="text-white/50">Border:</span> {config.border || "—"}
        </li>
      </ul>
      <button className="w-full rounded-xl bg-brand-yellow py-3 font-bold text-brand-black hover:opacity-90 transition-opacity">
        Add to cart
      </button>
    </div>
  );
}

// ─── Reusable Toggle ──────────────────────────────────────────────────────────
function Toggle({
  heading,
  label,
  checked,
  onChange,
}: {
  heading: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold mb-1">{heading}</p>
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            checked ? "bg-green-500" : "bg-black/30"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm">{label}</span>
      </label>
    </div>
  );
}

// ─── Panel map (the key insight) ─────────────────────────────────────────────
//   Instead of array[index], we use a Record keyed by TabId.
//   Each entry is a render function that receives config + onChange.
//   Adding a new tab = adding one entry here. Nothing else changes.

type PanelProps = {
  config: PlateConfig;
  onChange: (p: Partial<PlateConfig>) => void;
};

const PANELS: Record<TabId, (props: PanelProps) => React.ReactNode> = {
  start: ({ config, onChange }) => (
    <StartPanel config={config} onChange={onChange} />
  ),
  style: ({ config, onChange }) => (
    <StylePanel config={config} onChange={onChange} />
  ),
  sizing: ({ config, onChange }) => (
    <SizingPanel config={config} onChange={onChange} />
  ),
  border: ({ config, onChange }) => (
    <BorderPanel config={config} onChange={onChange} />
  ),
  finish: ({ config }) => <FinishPanel config={config} />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG: PlateConfig = {
  registration: "",
  legalSpacing: true,
  wantFront: true,
  wantBack: true,
  style: null,
  frontSize: null,
  backSize: null,
  border: null,
  badge: null,
};

export default function PlateBuilderPage() {
  const [activeTab, setActiveTab] = useState<TabId>("start");
  const [config, setConfig] = useState<PlateConfig>(DEFAULT_CONFIG);

  const patch = (partial: Partial<PlateConfig>) =>
    setConfig((prev) => ({ ...prev, ...partial }));

  console.log("Current config:", config); // For debugging

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <div className="bg-brand-dark border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-1">
            Customise
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white">
            PLATE BUILDER
          </h1>
        </div>
      </div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 py-8">
        <label className="block text-xs font-bold uppercase tracking-widest mb-1">
          Your registration
        </label>
        <input
          className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 font-mono text-lg font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black/30 text-red-700"
          value={config.registration}
          maxLength={8}
          pattern="[A-Z]{2}\d{2}[A-Z]{3}"
          onChange={(e) =>
            patch({ registration: e.target.value.toUpperCase() })
          }
        />
        {/* Top tab bar */}
        <ul className="flex space-x-6 mb-8 border-b border-white/10 py-3">
          {TABS.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-1 text-sm font-semibold uppercase tracking-widest transition-colors ${
                activeTab === tab.id
                  ? "text-brand-yellow border-b-2 border-brand-yellow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>

        <div className="grid lg:grid-cols-[320px_1fr_380px] gap-8">
          {/* ── Left sidebar: panel for the active tab ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            {PANELS[activeTab]({ config, onChange: patch })}
          </div>

          {/* ── Centre: plate preview ── */}
          <div className="flex flex-col gap-6">
            {/* Front / Rear toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {["FRONT PLATE", "REAR PLATE"].map((label) => (
                <button
                  key={label}
                  className="flex-1 py-2 text-sm font-bold tracking-widest text-white/60 hover:bg-white/5 transition-colors last:bg-brand-yellow last:text-brand-black"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Plate preview */}
            <div className="flex items-center justify-center rounded-2xl bg-brand-yellow p-8 shadow-2xl min-h-[180px]">
              <span className="font-heading text-7xl font-black text-brand-black tracking-widest drop-shadow-lg">
                {config.registration || "PLATE"}
              </span>
            </div>
          </div>

          {/* ── Right sidebar: order summary ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-2xl text-white mb-5">
                ORDER SUMMARY
              </h2>
              <div className="space-y-3 text-sm">
                {[
                  ["Plate Style", config.style ?? "—"],
                  ["Registration", config.registration || "—"],
                  ["Front Size", config.frontSize ?? "—"],
                  ["Back Size", config.backSize ?? "—"],
                  ["Border", config.border ?? "—"],
                  ["Badge", config.badge ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/50">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Free Delivery</span>
                    <span>£0.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Free Fixing Kit</span>
                    <span>£0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-brand-yellow">£29.99</span>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-brand-yellow py-3 font-bold text-brand-black hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
