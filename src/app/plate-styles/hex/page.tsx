"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag } from "lucide-react";
import ProductGallery from "@/components/productPlate/ProductGallery";
import OptionSelect from "@/components/productPlate/OptionSelect";
import { useAppDispatch } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/lib/features/cartSlice";
import { formatRegistration } from "@/lib/utils";

const GALLERY_IMAGES = [
  "/product-plates/hex/1.png",
  "/product-plates/hex/2.jpg",
  "/product-plates/hex/3.jpg",
  "/product-plates/hex/4.png",
  "/product-plates/hex/5.png",
];

const PLATE_SIZE_OPTIONS = [
  { value: "7", label: "7 Digits", price: 10 },
  { value: "6", label: "6 Digits", price: 8 },
  { value: "5", label: "5 Digits", price: 6 },
  { value: "4", label: "4 Digits", price: 4 },
];

const DIGIT_STYLE_OPTIONS = [
  { value: "3d-gel", label: "3D Gel", price: 5 },
  { value: "4d-3mm", label: "4D 3mm", price: 5 },
  { value: "4d-5mm", label: "4D 5mm", price: 8 },
  { value: "4d-gel", label: "4D Gel", price: 10 },
  { value: "printed", label: "Printed", price: 0 },
  { value: "retro", label: "Retro", price: 10 },
];

const BASE_PRICE = 24;

export default function HexPlatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [plateSize, setPlateSize] = useState("");
  const [digitStyle, setDigitStyle] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sizeChoice = PLATE_SIZE_OPTIONS.find((o) => o.value === plateSize);
  const digitChoice = DIGIT_STYLE_OPTIONS.find((o) => o.value === digitStyle);

  const unitPrice = useMemo(
    () => BASE_PRICE + (sizeChoice?.price ?? 0) + (digitChoice?.price ?? 0),
    [sizeChoice, digitChoice],
  );

  const totalPrice = unitPrice * quantity;

  const canAddToCart = Boolean(plateSize && digitStyle && plateNumber.trim());

  function handleAddToCart() {
    if (!canAddToCart) {
      toast({
        title: "Missing details",
        description:
          "Please choose a plate size, digit style, and enter your registration.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addItem({
        id: `hex-${plateNumber}-${plateSize}-${digitStyle}-${Date.now()}`,
        plateNumber: formatRegistration(plateNumber),
        roadLegalSpacing: true,
        frontPrice: unitPrice,
        rearPrice: 0,
        quantity,
        front: {
          styleName: `Hex Plate — ${digitChoice?.label ?? ""}`,
          sizeKey: `hex-${sizeChoice?.value ?? ""}`,
          borderType: null,
          borderThickness: null,
          gelName: null,
        },
      }),
    );

    toast({
      title: "Added to basket",
      description: `Hex Plate (${digitChoice?.label}) — ${formatRegistration(plateNumber)}`,
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
          <ProductGallery images={GALLERY_IMAGES} alt="Hex Number Plate" />

          {/* Configurator */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow-dark mb-2">
              7 / 6 / 5 / 4 — Digits Available
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight mb-3">
              Hex Plates
            </h1>
            <p className="text-gray-500 mb-6">
              Hexagon-cut acrylic plates for a unique geometric look, available
              in multiple digit counts and finishes.
            </p>

            <div className="rounded-2xl border border-gray-200 p-5">
              <OptionSelect
                label="Plate Sizes"
                value={plateSize}
                onChange={setPlateSize}
                options={PLATE_SIZE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              <OptionSelect
                label="Digit Styles"
                value={digitStyle}
                onChange={setDigitStyle}
                options={DIGIT_STYLE_OPTIONS.map((o) => ({
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
                  placeholder="e.g. HEX PL8"
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

            <ul className="mt-6 space-y-2">
              {["Unique Hexagon Design", "Every Order Custom Made", "Free UK Delivery"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-brand-yellow-dark flex-shrink-0" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
