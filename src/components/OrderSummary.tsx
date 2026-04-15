"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  increaseQty,
  decreaseQty,
} from "@/lib/features/cartSlice";

export default function OrderSummary() {
  const { items } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc: number, item: any) => {
    const itemTotal =
      (item.frontPrice + item.rearPrice) * item.quantity;
    return acc + itemTotal;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order Summary</h1>

      {items.length === 0 && <p>No items in cart</p>}

      {items.map((item: any) => (
        <div
          key={item.id}
          className="border p-4 rounded-lg flex justify-between"
        >
          <div>
            <p className="font-bold text-black">{item.plateNumber}</p>
            <p className="text-sm text-yellow-400">
              {item.roadLegalSpacing ? "Road legal" : "Not road legal"}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => dispatch(decreaseQty(item.id))}
                className="px-2 bg-gray-200 text-black"
              >
                -
              </button>
              <span className="text-black">{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQty(item.id))}
                className="px-2 bg-gray-200 text-black"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-black">
              £{((item.frontPrice + item.rearPrice) * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => dispatch(removeItem(item.id))}
              className="text-red-500 text-sm mt-2"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right text-xl font-bold text-black">
        Total: £{total.toFixed(2)}
      </div>
    </div>
  );
}