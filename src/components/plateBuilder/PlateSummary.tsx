import React, { useState } from "react";
import { Border, GelColors, PlateSize } from "../../style/PlateStyles";
import { useToast } from "@/hooks/use-toast";
import { saveBasket } from "@/lib/basket";
import { useRouter } from "next/navigation";
import { saveCurrentOrderId } from "@/lib/orderClient";

interface PlateSummaryProps {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  frontStyle: any;
  rearStyle: any;
  frontPrice: number;
  rearPrice: number;
  frontSize:PlateSize;
  rearSize:PlateSize;
  frontBorder:Border;
  rearBorder:Border;
  frontGel: GelColors | null;
  rearGel: GelColors | null;
}

const PlateSummary: React.FC<PlateSummaryProps> = ({
  plateNumber,
  roadLegalSpacing,
  wantFront,
  wantBack,
  frontStyle,
  rearStyle,
  frontPrice,
  rearPrice,
  frontSize,
  rearSize,
  rearBorder,
  frontBorder,
  frontGel,
  rearGel,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = isLoading || !plateNumber || (!wantFront && !wantBack);

  async function addToBasket() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const basket = {
        plateNumber,
        roadLegalSpacing,
        wantFront,
        wantBack,
        front: wantFront
          ? {
              styleName: frontStyle.name,
              sizeKey: frontSize.key,
              borderType: frontBorder.type,
              borderThickness: frontBorder.material?.thickness ?? null,
              gelName: frontGel?.name ?? null,
            }
          : undefined,
        rear: wantBack
          ? {
              styleName: rearStyle.name,
              sizeKey: rearSize.key,
              borderType: rearBorder.type,
              borderThickness: rearBorder.material?.thickness ?? null,
              gelName: rearGel?.name ?? null,
            }
          : undefined,
      };

      // Keep a local copy for safety (e.g. if server order store resets during dev).
      saveBasket(basket);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basket),
      });

      const json = (await res.json().catch(() => ({}))) as {
        orderId?: string;
        error?: string;
      };

      if (!res.ok || !json.orderId) {
        toast({
          title: "Basket error",
          description: json?.error ?? "Failed to create order.",
          variant: "destructive",
        });
        return;
      }

      saveCurrentOrderId(json.orderId);

      toast({ title: "Added to basket", description: "Continue to checkout." });
      router.push("/checkout");
    } catch (e: any) {
      toast({
        title: "Basket error",
        description: e?.message ?? "Failed to add to basket.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-sm mx-auto border border-gray-300">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Plates</h2>

      {/* Plate Number and Spacing */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <p className="text-sm font-medium text-gray-600">Registration</p>
          <p className="text-base font-bold text-gray-800">{plateNumber}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-600">Spacing</p>
          <p className="text-black font-bold text-gray-800">
            {roadLegalSpacing ? "Road legal" : "Not road legal"}
          </p>
        </div>
      </div>

      {/* Front Plate */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Front Plate</h3>
        <div className="flex justify-between text-sm mb-1">
          <p className="text-sm font-medium text-gray-600">Style</p>
          <p className="font-bold text-black">{frontStyle.name}</p>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <p className="text-sm font-medium text-gray-600">Size</p>
          <p className="font-bold text-black">Included</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-sm font-medium text-gray-600">Price</p>
          <p className="font-bold text-black">£{frontPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Rear Plate */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Rear Plate</h3>
        <div className="flex justify-between text-sm mb-1">
          <p className="text-sm font-medium text-gray-600">Style</p>
          <p className="font-bold text-black">{rearStyle.name}</p>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <p className="text-sm font-medium text-gray-600">Size</p>
          <p className="font-bold text-black">Included</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-sm font-medium text-gray-600">Price</p>
          <p className="font-bold text-black">£{rearPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <p>Total</p>
          <p>
            £
            {(
              (wantFront ? frontPrice : 0) + (wantBack ? rearPrice : 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add to Basket Button */}
      <button
        onClick={addToBasket}
        disabled={isDisabled}
        className="w-full bg-yellow-200 text-black font-bold py-3 rounded hover:bg-yellow/80 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "ADDING…" : "ADD TO BASKET"}
      </button>
    </div>
  );
};

export default PlateSummary;
