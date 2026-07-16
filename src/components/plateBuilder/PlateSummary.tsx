"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Border, GelColors, Plate, PlateSize } from "../../style/PlateStyles";
import { useAppDispatch } from "@/hooks/redux";
import { addItem } from "../../lib/features/cartSlice";
import { formatRegistration, plateSizeLabel } from "@/lib/utils";

interface PlateSummaryProps {
  plateNumber: string;
  roadLegalSpacing: boolean;
  wantFront: boolean;
  wantBack: boolean;
  frontStyle: Plate;
  rearStyle: Plate;
  frontPrice: number;
  rearPrice: number;
  frontSize: PlateSize;
  rearSize: PlateSize;
  frontBorder: Border;
  rearBorder: Border;
  frontGel: GelColors | null;
  rearGel: GelColors | null;
}

function SummaryRow({
  label,
  value,
  price,
}: {
  label: string;
  value: string;
  price?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-2.5 text-[15px]">
      <span className="text-gray-500">{label}</span>
      <span className="flex-1 text-right font-semibold text-gray-900">
        {value}
      </span>
      {price !== undefined && (
        <span className="w-20 text-right font-semibold text-gray-900">
          {price}
        </span>
      )}
    </div>
  );
}

function PlateSection({
  title,
  style,
  size,
  price,
  border,
  gel,
}: {
  title: string;
  style: Plate;
  size: PlateSize;
  price: number;
  border: Border;
  gel: GelColors | null;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
      <SummaryRow
        label="Style"
        value={style.name.trim()}
        price={`£${price.toFixed(2)}`}
      />
      <SummaryRow
        label="Size"
        value={plateSizeLabel(size.key)}
        price="Included"
      />
      {border.type !== "None" && (
        <SummaryRow label="Border" value={border.name.trim()} price="Included" />
      )}
      {gel && <SummaryRow label="Colour" value={gel.name} price="Included" />}
    </div>
  );
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
  const isDisabled = !plateNumber || (!wantFront && !wantBack);
  const dispatch = useAppDispatch();

  function addToBasketHandler() {
    if (isDisabled) return;

    dispatch(
      addItem({
        id: `${plateNumber}-${Date.now()}`,
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

    router.push("/cart");
  }

  const total = (wantFront ? frontPrice : 0) + (wantBack ? rearPrice : 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-extrabold text-gray-900">Your Plates</h2>

      <div className="mt-4">
        <SummaryRow
          label="Registration"
          value={plateNumber ? formatRegistration(plateNumber) : "—"}
        />
        <SummaryRow
          label="Spacing"
          value={roadLegalSpacing ? "Road legal" : "Not road legal"}
        />
      </div>

      {wantFront && (
        <PlateSection
          title="Front Plate"
          style={frontStyle}
          size={frontSize}
          price={frontPrice}
          border={frontBorder}
          gel={frontGel}
        />
      )}

      {wantBack && (
        <PlateSection
          title="Rear Plate"
          style={rearStyle}
          size={rearSize}
          price={rearPrice}
          border={rearBorder}
          gel={rearGel}
        />
      )}

      <div className="mt-5 flex items-center justify-between border-b border-gray-300 pb-3 text-xl">
        <span className="text-gray-700">Total</span>
        <span className="font-extrabold text-gray-900">
          £{total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={addToBasketHandler}
        disabled={isDisabled}
        className="mt-6 w-full rounded-lg bg-[#F5C843] py-4 text-xl font-extrabold tracking-wide text-black transition hover:bg-[#eebd2e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        ADD TO BASKET
      </button>
    </div>
  );
};

export default PlateSummary;
