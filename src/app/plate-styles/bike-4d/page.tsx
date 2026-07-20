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
  "/product-plates/bike-4d/1.png",
  "/product-plates/bike-4d/2.png",
  "/product-plates/bike-4d/3.png",
  "/product-plates/bike-4d/4.png",
  "/product-plates/bike-4d/5.png",
];

const BORDER_OPTIONS = [
  { value: "yes", label: "Yes", price: 1.25 },
  { value: "no", label: "No", price: 0 },
];

const LETTER_STYLE_OPTIONS = [
  { value: "3d-gel", label: "3D Gel", price: 5 },
  { value: "4d-3mm", label: "4D 3mm", price: 5 },
  { value: "printed", label: "Printed", price: 0 },
];

const BASE_PRICE = 15;

export default function MotorbikePlatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [border, setBorder] = useState("");
  const [letterStyle, setLetterStyle] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  const borderChoice = BORDER_OPTIONS.find((o) => o.value === border);
  const letterChoice = LETTER_STYLE_OPTIONS.find((o) => o.value === letterStyle);

  const unitPrice = useMemo(
    () => BASE_PRICE + (borderChoice?.price ?? 0) + (letterChoice?.price ?? 0),
    [borderChoice, letterChoice],
  );

  const totalPrice = unitPrice * quantity;

  const canAddToCart = Boolean(border && letterStyle && plateNumber.trim());

  function handleAddToCart() {
    if (!canAddToCart) {
      toast({
        title: "Missing details",
        description:
          "Please choose a border, letter style, and enter your registration.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addItem({
        id: `bike-4d-${plateNumber}-${border}-${letterStyle}-${Date.now()}`,
        plateNumber: formatRegistration(plateNumber),
        roadLegalSpacing: true,
        frontPrice: unitPrice,
        rearPrice: 0,
        quantity,
        front: {
          styleName: `MotorBike Plate — ${letterChoice?.label ?? ""}`,
          sizeKey: "motorbike",
          borderType: borderChoice?.value === "yes" ? "Printed" : "None",
          borderThickness: borderChoice?.value === "yes" ? 1 : null,
          gelName: null,
        },
      }),
    );

    toast({
      title: "Added to basket",
      description: `MotorBike Plate (${letterChoice?.label}) — ${formatRegistration(plateNumber)}`,
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
          <ProductGallery images={GALLERY_IMAGES} alt="MotorBike Number Plate" />

          {/* Configurator */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow-dark mb-2">
              228mm x 178mm
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight mb-3">
              MotorBike Plates
            </h1>
            <p className="text-gray-500 mb-6">
              Specially sized 4D plates for motorcycles and scooters — fully
              road legal and available with or without a border.
            </p>

            <div className="rounded-2xl border border-gray-200 p-5">
              <OptionSelect
                label="Border"
                value={border}
                onChange={setBorder}
                options={BORDER_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.price ? `${o.label} (+£${o.price.toFixed(2)})` : o.label,
                }))}
              />
              <OptionSelect
                label="Letter Style"
                value={letterStyle}
                onChange={setLetterStyle}
                options={LETTER_STYLE_OPTIONS.map((o) => ({
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
                  placeholder="e.g. BIKE 4D"
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
              {["Fits Motorcycles & Scooters", "100% Road Legal", "Free UK Delivery"].map(
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
