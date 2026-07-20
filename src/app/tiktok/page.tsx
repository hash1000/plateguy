import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PlateCard from "@/components/PlateCard";
import { plateStyles } from "@/data/plateStyles";

const featuredSlugs = ["standard", "hex"];

export default function TikTokPage() {
  const featured = featuredSlugs
    .map((slug) => plateStyles.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero */}
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            As Seen On TikTok
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none">
            OUR MOST-LOVED PLATES
          </h1>
          <p className="text-white/50 mt-3 max-w-xl">
            The two styles our TikTok community keeps asking for — build yours
            in a couple of clicks and get it delivered free.
          </p>
        </div>
      </section>

      {/* Featured grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            {featured.map((style) => (
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-4xl text-white mb-4">
            WANT TO SEE MORE STYLES?
          </h2>
          <p className="text-white/50 mb-6">
            Browse the full range of plate styles or jump straight into the
            builder to create something custom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/plate-styles"
              className="btn-shimmer text-brand-black font-bold px-8 py-3.5 rounded-xl tracking-wide inline-flex items-center gap-2"
            >
              ALL PLATE STYLES <ArrowRight size={16} />
            </Link>
            <Link
              href="/plate-builder"
              className="border border-white/10 bg-white/5 text-white font-bold px-8 py-3.5 rounded-xl tracking-wide hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              OPEN PLATE BUILDER
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
