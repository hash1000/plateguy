"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PlateCard from "@/components/PlateCard";
import { ArrowRight } from "lucide-react";
import { plateStyles, filterCategories, type PlateCategory } from "@/data/plateStyles";

const filters: ("All" | PlateCategory)[] = ["All", ...filterCategories];

export default function PlateStylesPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const visibleStyles = useMemo(() => {
    if (activeFilter === "All") return plateStyles;
    return plateStyles.filter((style) => style.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero */}
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                Our Collection
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none">
                ALL PLATE STYLES
              </h1>
              <p className="text-white/50 mt-3 max-w-xl">
                From classic 3D Gel to cutting-edge Neon 4D — every plate is
                expertly laser-cut, road legal, and delivered free to your door.
              </p>
            </div>
            <Link
              href="/plate-builder"
              className="flex-shrink-0 btn-shimmer text-brand-black font-bold px-8 py-3 rounded-xl tracking-wide flex items-center gap-2 self-start lg:self-auto"
            >
              BUILD NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <div className="bg-brand-gray border-b border-white/5 sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === filter
                    ? "bg-brand-yellow text-brand-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {visibleStyles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleStyles.map((style) => (
                <PlateCard
                  key={style.slug}
                  title={style.title}
                  href={`/plate-styles/${style.slug}`}
                  imageSrc={style.image}
                  badge={style.badge}
                  description={style.description}
                  isNew={style.isNew}
                  isBestSeller={style.isBestSeller}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              No plate styles found for &ldquo;{activeFilter}&rdquo;.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-4xl text-white mb-4">
            CAN&apos;T DECIDE? BUILD YOUR OWN
          </h2>
          <p className="text-white/50 mb-6">
            Use our interactive plate builder to see exactly how your plates
            will look before you order.
          </p>
          <Link
            href="/plate-builder"
            className="btn-shimmer text-brand-black font-bold px-10 py-4 rounded-xl tracking-wide inline-flex items-center gap-2"
          >
            OPEN PLATE BUILDER <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
