import Link from "next/link";
import PlateCard from "@/components/PlateCard";
import { ArrowRight } from "lucide-react";

const allStyles = [
  {
    title: "4D 3mm Plates",
    href: "/plate-styles/4d-3mm",
    isBestSeller: true,
    badge: "Road Legal",
    description:
      "Our most popular style. Laser-cut acrylic characters with 3mm raised depth for a bold, premium look.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-3MM-front-view-1.png",
  },
  {
    title: "4D 5mm Plates",
    href: "/plate-styles/4d-5mm",
    badge: "Road Legal",
    description:
      "Maximum impact with 5mm raised acrylic characters. The deepest 4D plates we offer.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-5MM-front-View-1-1024x576.png",
  },
  {
    title: "4D Gel 3mm Plates",
    href: "/plate-styles/4d-gel-3mm",
    badge: "Road Legal",
    description:
      "Acrylic characters finished with a smooth gel resin topping for the ultimate premium look.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-3MM-front-view-4.png",
  },
  {
    title: "4D Gel 5mm Plates",
    href: "/plate-styles/4d-gel-5mm",
    badge: "Road Legal",
    description:
      "5mm acrylic depth combined with gel resin. The pinnacle of number plate styling.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-Gel-Side-View-2.png",
  },
  {
    title: "Neon 4D Show Plates",
    href: "/plate-styles/neon-4d",
    isNew: true,
    badge: "Show Plate",
    description:
      "Stunning neon-coloured 4D show plates available in multiple vibrant colour options.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Neon-4D-1-1024x576.png",
  },
  {
    title: "Neon Gel Show Plates",
    href: "/plate-styles/neon-gel",
    isNew: true,
    badge: "Show Plate",
    description:
      "Our most eye-catching show plates with glowing gel characters that demand attention.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Neon-Gel-front-View-1.png",
  },
  {
    title: "3D Gel Plates",
    href: "/plate-styles/3d",
    badge: "Road Legal",
    description:
      "Classic gel resin characters with a rounded, domed appearance. A timeless look.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/3D-Gel-Side-View.png",
  },
  {
    title: "Bubble Plates",
    href: "/plate-styles/bubble",
    badge: "Road Legal",
    description:
      "Unique shaped background plate with domed gel characters for a truly distinctive look.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Bubble-Plate-front-View-1-1024x576.png",
  },
  {
    title: "Printed Plates",
    href: "/plate-styles/printed",
    badge: "Road Legal",
    description:
      "High-quality standard printed plates at an affordable price. Fast turnaround.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Printed-front-view-1-1024x576.png",
  },
  {
    title: "Bike 4D Plates",
    href: "/plate-styles/bike-4d",
    badge: "Road Legal",
    description:
      "Specially designed 4D plates for motorcycles and scooters.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Bike-4D-Side-View-1.png",
  },
  {
    title: "4x4 Gel Plates",
    href: "/plate-styles/4x4",
    badge: "Road Legal",
    description:
      "Oversized 4x4 format plates with premium gel characters for SUVs and trucks.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Jeep-Gel-front-View-1-1024x576.png",
  },
  {
    title: "Hex Plates",
    href: "/plate-styles/hex",
    isNew: true,
    badge: "Show Plate",
    description:
      "Hexagon pattern acrylic plates for a unique geometric styling.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Hex-Plate-1.png",
  },
];

export default function PlateStylesPage() {
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
            {["All", "4D", "3D", "Neon", "Gel", "Bubble", "Printed", "Bike", "Show Plate"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    filter === "All"
                      ? "bg-brand-yellow text-brand-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allStyles.map((style) => (
              <PlateCard key={style.href} {...style} />
            ))}
          </div>
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
