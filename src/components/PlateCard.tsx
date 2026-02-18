import Link from "next/link";

interface PlateCardProps {
  title: string;
  href: string;
  imageSrc?: string;
  badge?: string;
  description?: string;
  price?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function PlateCard({
  title,
  href,
  imageSrc,
  badge,
  description,
  price,
  isNew,
  isBestSeller,
}: PlateCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="plate-card bg-brand-gray border border-white/5 rounded-2xl overflow-hidden h-full">
        {/* Image */}
        <div className="relative bg-gradient-to-br from-brand-gray-mid to-brand-gray-light aspect-video overflow-hidden">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <PlaceholderPlate title={title} />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                NEW
              </span>
            )}
            {isBestSeller && (
              <span className="bg-brand-yellow text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                BEST SELLER
              </span>
            )}
            {badge && (
              <span className="bg-brand-black/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading text-lg text-white tracking-wide group-hover:text-brand-yellow transition-colors duration-200">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            {price && (
              <span className="text-brand-yellow font-bold text-sm">{price}</span>
            )}
            <span className="text-xs font-semibold text-white/60 group-hover:text-brand-yellow transition-colors ml-auto flex items-center gap-1">
              SHOP NOW
              <svg
                className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderPlate({ title }: { title: string }) {
  const isNeon = title.toLowerCase().includes("neon");
  const isGel = title.toLowerCase().includes("gel");

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div
        className={`uk-plate w-full max-w-[280px] text-center ${
          isNeon ? "shadow-[0_0_20px_rgba(255,0,255,0.5)]" : ""
        } ${isGel ? "shadow-[0_0_15px_rgba(0,200,255,0.3)]" : ""}`}
      >
        <span className="text-2xl sm:text-3xl font-black tracking-[0.15em]">
          PG24 GUY
        </span>
      </div>
    </div>
  );
}
