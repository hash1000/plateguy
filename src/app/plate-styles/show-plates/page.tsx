"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import ProductGallery from "@/components/productPlate/ProductGallery";
import OptionSelect from "@/components/productPlate/OptionSelect";
import { useAppDispatch } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/lib/features/cartSlice";
import { formatRegistration } from "@/lib/utils";

const GALLERY_IMAGES = [
  "/product-plates/show-plates/1.png",
  "/product-plates/show-plates/2.png",
  "/product-plates/show-plates/3.png",
  "/product-plates/show-plates/4.png",
  "/product-plates/show-plates/5.png",
];

const LETTER_STYLE_OPTIONS = [
  { value: "neon-gel-3d-blue", label: "Neon Gel 3D Blue" },
  { value: "neon-gel-3d-green", label: "Neon Gel 3D Green" },
  { value: "neon-gel-3d-red", label: "Neon Gel 3D Red" },
  { value: "neon-gel-4d-blue", label: "Neon Gel 4D Blue" },
  { value: "neon-gel-4d-green", label: "Neon Gel 4D Green" },
  { value: "neon-gel-4d-red", label: "Neon Gel 4D Red" },
];

const PLATE_STYLE_OPTIONS = [
  { value: "hex-5", label: "Hex 5" },
  { value: "hex-6", label: "Hex 6" },
  { value: "hex-7", label: "Hex 7" },
  { value: "short-5", label: "Short 5" },
  { value: "short-6", label: "Short 6" },
  { value: "standard", label: "Standard Plate" },
];

const BORDER_OPTIONS = [
  { value: "yes", label: "Yes", price: 1.25 },
  { value: "no", label: "No", price: 0 },
];

const BASE_PRICE = 40;

export default function ShowPlatesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [letterStyle, setLetterStyle] = useState("");
  const [plateStyle, setPlateStyle] = useState("");
  const [border, setBorder] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  const letterChoice = LETTER_STYLE_OPTIONS.find((o) => o.value === letterStyle);
  const styleChoice = PLATE_STYLE_OPTIONS.find((o) => o.value === plateStyle);
  const borderChoice = BORDER_OPTIONS.find((o) => o.value === border);

  const unitPrice = useMemo(
    () => BASE_PRICE + (borderChoice?.price ?? 0),
    [borderChoice],
  );

  const totalPrice = unitPrice * quantity;

  const canAddToCart = Boolean(
    letterStyle && plateStyle && border && plateNumber.trim(),
  );

  function handleAddToCart() {
    if (!canAddToCart) {
      toast({
        title: "Missing details",
        description:
          "Please choose a letter style, plate style, border, and enter your registration.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addItem({
        id: `show-plates-${plateNumber}-${letterStyle}-${plateStyle}-${border}-${Date.now()}`,
        plateNumber: formatRegistration(plateNumber),
        roadLegalSpacing: false,
        frontPrice: unitPrice,
        rearPrice: 0,
        quantity,
        front: {
          styleName: `Show Plate — ${letterChoice?.label ?? ""} (${styleChoice?.label ?? ""})`,
          sizeKey: styleChoice?.value ?? "standard",
          borderType: borderChoice?.value === "yes" ? "Printed" : "None",
          borderThickness: borderChoice?.value === "yes" ? 1 : null,
          gelName: letterChoice?.label ?? null,
        },
      }),
    );

    toast({
      title: "Added to basket",
      description: `Show Plate (${letterChoice?.label}) — ${formatRegistration(plateNumber)}`,
    });

    router.push("/cart");
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/plate-styles"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> All Plate Styles
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Gallery */}
          <ProductGallery images={GALLERY_IMAGES} alt="Show Plate" />

          {/* Configurator */}
          <div>
            <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase mb-2">
              Not Road Legal
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight mb-3">
              Show Plates
            </h1>
            <p className="text-gray-500 mb-6">
              Glowing neon gel show plates in a range of colours — a
              head-turning finish for display use only.
            </p>

            <div className="rounded-2xl border border-gray-200 p-5">
              <OptionSelect
                label="Letter Style"
                value={letterStyle}
                onChange={setLetterStyle}
                options={LETTER_STYLE_OPTIONS}
              />
              <OptionSelect
                label="Plate Style"
                value={plateStyle}
                onChange={setPlateStyle}
                options={PLATE_STYLE_OPTIONS}
              />
              <OptionSelect
                label="Border"
                value={border}
                onChange={setBorder}
                options={BORDER_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.price ? `${o.label} (+£${o.price.toFixed(2)})` : o.label,
                }))}
              />

              {/* Registration input */}
              <div className="py-4">
                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Enter Registration No.
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. NEON 4D"
                  maxLength={10}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-bold tracking-wider uppercase focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
                />
                {plateNumber && (
                  <p className="mt-2 text-sm text-gray-500">
                    Preview: <span className="font-bold text-gray-900">{formatRegistration(plateNumber)}</span>
                  </p>
                )}
              </div>

              {/* Quantity + price */}
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-2xl font-extrabold">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-yellow py-4 text-lg font-extrabold tracking-wide text-brand-black transition hover:bg-brand-yellow-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={20} /> ADD TO CART
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <p>
                These are premium show plates and are <strong>not road
                legal</strong>. They are intended for display use only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
