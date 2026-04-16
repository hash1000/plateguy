import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Border, GelColors, PlateSize } from "../../style/PlateStyles";
import { useAppDispatch } from "@/hooks/redux";
import { addItem } from "../../lib/features/cartSlice";

interface PlateSummaryProps {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  frontStyle: any;
  rearStyle: any;
  frontPrice: number;
  rearPrice: number;
  frontSize: PlateSize;
  rearSize: PlateSize;
  frontBorder: Border;
  rearBorder: Border;
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = isLoading || !plateNumber || (!wantFront && !wantBack);
  const dispatch = useAppDispatch();

  function addToCartHandler() {
    if (isDisabled) return;

    const id = [
      plateNumber.trim().toUpperCase(),
      roadLegalSpacing ? "road" : "show",
      wantFront
        ? `F:${frontStyle?.name ?? ""}:${frontSize.key}:${frontBorder.type}:${
            frontBorder.material?.thickness ?? ""
          }:${frontGel?.name ?? ""}`
        : "F:none",
      wantBack
        ? `R:${rearStyle?.name ?? ""}:${rearSize.key}:${rearBorder.type}:${
            rearBorder.material?.thickness ?? ""
          }:${rearGel?.name ?? ""}`
        : "R:none",
    ].join("|");

    dispatch(
      addItem({
        id,
        plateNumber,
        roadLegalSpacing,
        frontPrice: wantFront ? frontPrice : 0,
        rearPrice: wantBack ? rearPrice : 0,
        quantity: 1,
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
      })
    );

    router.push("/checkout");
  }

  const total =
    (wantFront ? frontPrice : 0) + (wantBack ? rearPrice : 0);

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
          <p className="font-bold text-gray-800">
            {roadLegalSpacing ? "Road legal" : "Not road legal"}
          </p>
        </div>
      </div>

      {/* Front Plate */}
      {wantFront && (
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-base font-bold text-gray-800 mb-2">Front Plate</h3>
          <div className="flex justify-between text-sm mb-1">
            <p className="text-sm font-medium text-gray-600">Style</p>
            <p className="font-bold text-black">{frontStyle.name}</p>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <p className="text-sm font-medium text-gray-600">Size</p>
            <p className="font-bold text-black">{frontSize.key}</p>
          </div>
          {frontBorder?.type && frontBorder.type !== "None" && (
            <div className="flex justify-between text-sm mb-1">
              <p className="text-sm font-medium text-gray-600">Border</p>
              <p className="font-bold text-black">
                {frontBorder.type}{" "}
                {frontBorder.material?.thickness
                  ? `${frontBorder.material.thickness}mm`
                  : ""}
              </p>
            </div>
          )}
          {frontGel && (
            <div className="flex justify-between text-sm mb-1">
              <p className="text-sm font-medium text-gray-600">Gel</p>
              <p className="font-bold text-black">{frontGel.name}</p>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <p className="text-sm font-medium text-gray-600">Price</p>
            <p className="font-bold text-black">£{frontPrice.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Rear Plate */}
      {wantBack && (
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-base font-bold text-gray-800 mb-2">Rear Plate</h3>
          <div className="flex justify-between text-sm mb-1">
            <p className="text-sm font-medium text-gray-600">Style</p>
            <p className="font-bold text-black">{rearStyle.name}</p>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <p className="text-sm font-medium text-gray-600">Size</p>
            <p className="font-bold text-black">{rearSize.key}</p>
          </div>
          {rearBorder?.type && rearBorder.type !== "None" && (
            <div className="flex justify-between text-sm mb-1">
              <p className="text-sm font-medium text-gray-600">Border</p>
              <p className="font-bold text-black">
                {rearBorder.type}{" "}
                {rearBorder.material?.thickness
                  ? `${rearBorder.material.thickness}mm`
                  : ""}
              </p>
            </div>
          )}
          {rearGel && (
            <div className="flex justify-between text-sm mb-1">
              <p className="text-sm font-medium text-gray-600">Gel</p>
              <p className="font-bold text-black">{rearGel.name}</p>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <p className="text-sm font-medium text-gray-600">Price</p>
            <p className="font-bold text-black">£{rearPrice.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <p>Total</p>
          <p>£{total.toFixed(2)}</p>
        </div>
      </div>

      {/* Proceed to Checkout */}
      <button
        onClick={addToCartHandler}
        disabled={isDisabled}
        className="w-full bg-yellow-200 text-black font-bold py-3 rounded hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "LOADING…" : "PROCEED TO CHECKOUT"}
      </button>
    </div>
  );
};

export default PlateSummary;
