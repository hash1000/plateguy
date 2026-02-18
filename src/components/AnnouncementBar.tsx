"use client";
import { useState } from "react";
import { X, Truck, Star } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-brand-yellow text-brand-black relative overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap py-2.5 text-sm font-semibold tracking-wide">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center gap-6 px-8">
            <span className="flex items-center gap-1.5">
              <Truck size={14} />
              FREE DELIVERY ON ALL ORDERS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Star size={14} />
              FREE FIXING KIT INCLUDED
            </span>
            <span>•</span>
            <span>3-YEAR WARRANTY</span>
            <span>•</span>
            <span>100% ROAD LEGAL</span>
            <span>•</span>
            <span>DVLA REGISTERED SUPPLIER</span>
            <span>•</span>
          </span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
