import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { plateStyles } from "@/data/plateStyles";

export function generateStaticParams() {
  return plateStyles.map((style) => ({ slug: style.slug }));
}

export default async function PlateStyleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const style = plateStyles.find((s) => s.slug === slug);

  if (!style) notFound();

  const related = plateStyles.filter((s) => s.slug !== style.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/plate-styles"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> All Plate Styles
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="bg-brand-gray border border-white/5 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={style.image}
              alt={style.title}
              className="w-full h-full object-contain p-8"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {style.isNew && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  NEW
                </span>
              )}
              {style.isBestSeller && (
                <span className="bg-brand-yellow text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  BEST SELLER
                </span>
              )}
              {style.badge && (
                <span className="bg-white/10 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {style.badge}
                </span>
              )}
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl text-white leading-tight mb-4">
              {style.title}
            </h1>

            <p className="text-white/60 leading-relaxed mb-6">
              {style.description}
            </p>

            <ul className="space-y-2 mb-8">
              {["100% Road Legal & DVLA Compliant", "3-Year Warranty", "Free UK Delivery"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-brand-yellow flex-shrink-0" />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <Link
              href="/plate-builder"
              className="btn-shimmer text-brand-black font-bold px-8 py-3.5 rounded-xl tracking-wide inline-flex items-center gap-2"
            >
              BUILD THIS STYLE <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Related styles */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="font-heading text-2xl text-white mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/plate-styles/${r.slug}`}
                className="group block bg-brand-gray border border-white/5 rounded-2xl overflow-hidden"
              >
                <div className="aspect-video bg-brand-gray-mid flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base text-white group-hover:text-brand-yellow transition-colors">
                    {r.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
