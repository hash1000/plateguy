"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";

const plateTypes = [
  { id: "4d-3mm", label: "4D 3mm", price: "£34.99", popular: true },
  { id: "4d-5mm", label: "4D 5mm", price: "£39.99" },
  { id: "4d-gel-3mm", label: "4D Gel 3mm", price: "£44.99" },
  { id: "4d-gel-5mm", label: "4D Gel 5mm", price: "£49.99" },
  { id: "neon-4d", label: "Neon 4D", price: "£54.99", isNew: true },
  { id: "neon-gel", label: "Neon Gel", price: "£54.99", isNew: true },
  { id: "3d-gel", label: "3D Gel", price: "£24.99" },
  { id: "bubble", label: "Bubble", price: "£34.99" },
  { id: "printed", label: "Printed", price: "£14.99" },
];

const plateSizes = [
  { id: "std-front", label: "Standard Front", dimensions: '520 x 111mm', vehicleType: "Car" },
  { id: "std-rear", label: "Standard Rear (Oblong)", dimensions: '520 x 111mm', vehicleType: "Car" },
  { id: "square", label: "Square", dimensions: '279 x 203mm', vehicleType: "Car" },
  { id: "motorbike", label: "Motorbike", dimensions: '228 x 178mm', vehicleType: "Bike" },
  { id: "4x4", label: "4x4 / SUV", dimensions: '533 x 152mm', vehicleType: "4x4" },
];

const borders = ["None", "Standard", "Honeycomb", "Diamond"];
const badges = ["None", "UK Flag", "EU", "Welsh Dragon", "Scottish Flag"];
const fonts = ["Standard", "Carbon", "Italic"];

const neonColors = [
  { id: "purple", label: "Purple", color: "#a855f7" },
  { id: "pink", label: "Pink", color: "#ec4899" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "red", label: "Red", color: "#ef4444" },
  { id: "orange", label: "Orange", color: "#f97316" },
];

export default function PlateBuilderPage() {
  const [plateText, setPlateText] = useState("AB12 CDE");
  const [plateType, setPlateType] = useState("4d-3mm");
  const [plateSize, setPlateSize] = useState("std-front");
  const [plateCount, setPlateCount] = useState<"front" | "rear" | "both">("both");
  const [border, setBorder] = useState("None");
  const [badge, setBadge] = useState("UK Flag");
  const [font, setFont] = useState("Standard");
  const [neonColor, setNeonColor] = useState("purple");

  const selectedType = plateTypes.find((t) => t.id === plateType);
  const isNeon = plateType.includes("neon");
  const isRear = plateSize.includes("rear");

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Preview + Options */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-4">
                Live Preview
              </h2>
              <div className="space-y-4">
                {(plateCount === "front" || plateCount === "both") && (
                  <div>
                    <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Front Plate</p>
                    <div
                      className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300 p-4 flex items-center gap-3"
                      style={{
                        background: "#F5F5DC",
                        boxShadow: isNeon
                          ? `0 0 30px ${neonColors.find((c) => c.id === neonColor)?.color}40`
                          : "0 8px 30px rgba(0,0,0,0.4)",
                      }}
                    >
                      {badge !== "None" && (
                        <div className="flex flex-col items-center justify-center bg-[#003399] rounded-sm px-2 py-1 min-w-[32px]">
                          <div className="text-[#FFCC00] text-[7px] font-bold">UK</div>
                          <div className="w-4 h-2 bg-[#FFCC00]/60 rounded-[1px] mt-0.5" />
                        </div>
                      )}
                      <span
                        className="font-black text-3xl sm:text-4xl tracking-[0.15em] font-mono text-black"
                        style={
                          isNeon
                            ? {
                                color: neonColors.find((c) => c.id === neonColor)?.color,
                                textShadow: `0 0 10px currentColor, 0 0 20px currentColor`,
                              }
                            : {}
                        }
                      >
                        {plateText || "YOUR REG"}
                      </span>
                    </div>
                  </div>
                )}

                {(plateCount === "rear" || plateCount === "both") && (
                  <div>
                    <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Rear Plate</p>
                    <div
                      className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-400 p-4 flex items-center gap-3"
                      style={{
                        background: "#FFA500",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                      }}
                    >
                      {badge !== "None" && (
                        <div className="flex flex-col items-center justify-center bg-[#003399] rounded-sm px-2 py-1 min-w-[32px]">
                          <div className="text-[#FFCC00] text-[7px] font-bold">UK</div>
                          <div className="w-4 h-2 bg-[#FFCC00]/60 rounded-[1px] mt-0.5" />
                        </div>
                      )}
                      <span className="font-black text-3xl sm:text-4xl tracking-[0.15em] font-mono text-black">
                        {plateText || "YOUR REG"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Input */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-xl text-white mb-4">1. ENTER YOUR REG</h2>
              <input
                type="text"
                value={plateText}
                onChange={(e) => setPlateText(e.target.value.toUpperCase())}
                placeholder="e.g. AB12 CDE"
                maxLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-mono font-bold tracking-widest text-center focus:outline-none focus:border-brand-yellow/50 uppercase placeholder-white/20 transition-colors"
              />
              <p className="text-xs text-white/30 text-center mt-2">
                Enter your vehicle registration number
              </p>
            </div>

            {/* Plate Type */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-xl text-white mb-4">2. SELECT PLATE STYLE</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {plateTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPlateType(type.id)}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                      plateType === type.id
                        ? "border-brand-yellow bg-brand-yellow/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    {type.popular && (
                      <span className="absolute -top-2 -right-2 text-[9px] bg-brand-yellow text-brand-black font-bold px-1.5 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                    {type.isNew && (
                      <span className="absolute -top-2 -right-2 text-[9px] bg-green-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <p className={`text-sm font-semibold ${plateType === type.id ? "text-brand-yellow" : "text-white"}`}>
                      {type.label}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{type.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Neon color */}
            {isNeon && (
              <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
                <h2 className="font-heading text-xl text-white mb-4">3. SELECT NEON COLOUR</h2>
                <div className="flex flex-wrap gap-3">
                  {neonColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setNeonColor(c.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        neonColor === c.id ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: c.color,
                          boxShadow: `0 0 8px ${c.color}`,
                        }}
                      />
                      <span className="text-sm text-white">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Plate Size */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-xl text-white mb-4">
                {isNeon ? "4" : "3"}. SELECT SIZE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plateSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setPlateSize(size.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      plateSize === size.id
                        ? "border-brand-yellow bg-brand-yellow/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${plateSize === size.id ? "text-brand-yellow" : "text-white"}`}>
                      {size.label}
                    </p>
                    <p className="text-xs text-white/40">{size.dimensions} • {size.vehicleType}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* How Many */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-xl text-white mb-4">
                {isNeon ? "5" : "4"}. HOW MANY PLATES?
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {(["front", "rear", "both"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPlateCount(opt)}
                    className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all ${
                      plateCount === opt
                        ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                        : "border-white/10 bg-white/5 text-white hover:border-white/20"
                    }`}
                  >
                    {opt === "both" ? "Front & Rear" : opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Customisation */}
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-xl text-white mb-4">
                {isNeon ? "6" : "5"}. CUSTOMISE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Border
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {borders.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBorder(b)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          border === b
                            ? "bg-brand-yellow text-brand-black"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Badge
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {badges.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBadge(b)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          badge === b
                            ? "bg-brand-yellow text-brand-black"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Font
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {fonts.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFont(f)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          font === f
                            ? "bg-brand-yellow text-brand-black"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-2xl text-white mb-5">ORDER SUMMARY</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Plate Style</span>
                  <span className="text-white font-medium">{selectedType?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Registration</span>
                  <span className="text-white font-mono font-bold">{plateText || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Size</span>
                  <span className="text-white font-medium">
                    {plateSizes.find((s) => s.id === plateSize)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Quantity</span>
                  <span className="text-white font-medium capitalize">
                    {plateCount === "both" ? "Front & Rear" : plateCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Border</span>
                  <span className="text-white font-medium">{border}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Badge</span>
                  <span className="text-white font-medium">{badge}</span>
                </div>

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
                    <span className="text-brand-yellow">
                      {selectedType?.price} {plateCount === "both" ? "(×2)" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-5 btn-shimmer text-brand-black font-bold py-4 rounded-xl tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-shadow">
                <ShoppingCart size={18} />
                ADD TO BASKET
              </button>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {["Road Legal", "3yr Warranty", "Free Kit"].map((badge) => (
                  <div key={badge} className="bg-white/5 rounded-lg py-2 px-1">
                    <p className="text-[10px] text-white/50 font-semibold">{badge}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Need help */}
            <div className="bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl p-4">
              <p className="text-sm font-semibold text-white mb-1">Need help?</p>
              <p className="text-xs text-white/50 mb-3">
                Our team is available Mon–Fri 9am–5pm
              </p>
              <Link
                href="/help/contact"
                className="text-xs text-brand-yellow font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Contact Us <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
