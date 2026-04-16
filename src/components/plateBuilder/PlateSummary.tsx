"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Border, GelColors, PlateSize } from "../../style/PlateStyles";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();

  const isDisabled = !plateNumber || (!wantFront && !wantBack);

  function addToCartHandler() {
    if (isDisabled) return;

    dispatch(
      addItem({
        id: `${plateNumber}-${Date.now()}`,
        plateNumber,
        roadLegalSpacing,
        frontPrice,
        rearPrice,
        quantity: 1,
        front: wantFront
          ? {
              styleName: frontStyle.name,
              sizeKey: frontSize.key,
              borderType: frontBorder.type,
              borderThickness:
                frontBorder.material?.thickness ?? null,
              gelName: frontGel?.name ?? null,
            }
          : undefined,
        rear: wantBack
          ? {
              styleName: rearStyle.name,
              sizeKey: rearSize.key,
              borderType: rearBorder.type,
              borderThickness:
                rearBorder.material?.thickness ?? null,
              gelName: rearGel?.name ?? null,
            }
          : undefined,
      })
    );

    router.push("/checkout");
  }

  const total =
    (wantFront ? frontPrice : 0) +
    (wantBack ? rearPrice : 0);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-sm mx-auto border border-gray-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Your Plates
      </h2>

      <p className="mb-2 font-semibold">{plateNumber}</p>

      <p className="mb-4 text-sm">
        {roadLegalSpacing ? "Road legal" : "Not road legal"}
      </p>

      <div className="font-bold text-lg mb-4">
        £{total.toFixed(2)}
      </div>

      <button
        onClick={addToCartHandler}
        disabled={isDisabled}
        className="w-full bg-yellow-200 py-3 rounded font-bold"
      >
        PROCEED TO CHECKOUT
      </button>
    </div>
  );
};

export default PlateSummary;