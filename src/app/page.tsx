import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import PlateCard from "@/components/PlateCard";
import TrustBadges from "@/components/TrustBadges";

const plateStyles = [
  {
    title: "4D 3mm Plates",
    href: "/plate-styles/4d-3mm",
    badge: "Most Popular",
    isBestSeller: true,
    description: "Bold acrylic characters with 3mm raised depth. Fully road legal.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-3MM-front-view-1.png",
  },
  {
    title: "4D 5mm Plates",
    href: "/plate-styles/4d-5mm",
    description: "Maximum depth 5mm acrylic characters for ultimate presence.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-5MM-front-View-1-1024x576.png",
  },
  {
    title: "Neon 4D Show Plates",
    href: "/plate-styles/neon-4d",
    isNew: true,
    description: "Vibrant neon-coloured 4D plates that turn heads everywhere.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Neon-4D-1-1024x576.png",
  },
  {
    title: "Neon Gel Show Plates",
    href: "/plate-styles/neon-gel",
    isNew: true,
    description: "Unique neon gel show plates with incredible glow effect.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Neon-Gel-Side-View-1-1024x576.png",
  },
  {
    title: "4D Gel Plates",
    href: "/plate-styles/4d-gel",
    description: "Acrylic characters with gel resin topping for a premium finish.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-Gel-Side-View-3-1024x576.png",
  },
  {
    title: "3D Gel Plates",
    href: "/plate-styles/3d",
    description: "Classic 3D gel resin characters with a smooth, domed look.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/3D-Gel-Side-View.png",
  },
  {
    title: "Bubble Plates",
    href: "/plate-styles/bubble",
    description: "Unique shaped background with domed gel characters.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Bubble-Plate-front-View-1-1024x576.png",
  },
  {
    title: "Printed Plates",
    href: "/plate-styles/printed",
    description: "High-quality printed plates at an affordable price.",
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/Printed-front-view-1-1024x576.png",
  },
];

const comparison = [
  {
    type: "3D (Gel)",
    features: [
      "Gel Resin Characters",
      "Rounded Style (Domed)",
      "Smaller Depth",
      "Fully Road Legal",
    ],
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/3D-Gel-Side-View-1.png",
    color: "from-blue-900/20 to-blue-800/10",
    border: "border-blue-500/20",
    accent: "text-blue-400",
  },
  {
    type: "4D (Acrylic)",
    features: [
      "Acrylic Characters",
      "Bolder Style (Solid)",
      "Greater Depths (3/5mm)",
      "Fully Road Legal",
    ],
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-3MM-front-view-4.png",
    color: "from-brand-yellow/10 to-amber-900/10",
    border: "border-brand-yellow/20",
    accent: "text-brand-yellow",
  },
  {
    type: "Bubble Plates",
    features: [
      "Gel Resin Characters",
      "Rounded Style (Domed)",
      "Unique Shaped Background",
      "Fully Road Legal",
    ],
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/P18-GUY-Bubble-Side-View.png",
    color: "from-purple-900/20 to-purple-800/10",
    border: "border-purple-500/20",
    accent: "text-purple-400",
  },
  {
    type: "4D Gel",
    features: [
      "Acrylic + Gel Topping",
      "Bolder Style & Domed",
      "Greater Depths (3/5mm)",
      "Fully Road Legal",
    ],
    imageSrc: "https://plateguy.co.uk/wp-content/uploads/2025/01/4D-Gel-Side-View-3.png",
    color: "from-green-900/20 to-green-800/10",
    border: "border-green-500/20",
    accent: "text-green-400",
  },
];

const reviews = [
  {
    name: "James T.",
    rating: 5,
    text: "Absolutely stunning plates! The 4D 5mm look incredible on my car. Fast delivery and perfectly packaged.",
    date: "2 weeks ago",
    product: "4D 5mm Plates",
  },
  {
    name: "Sarah M.",
    rating: 5,
    text: "Ordered neon gel show plates for my car show. The quality blew me away. Everyone was asking where I got them!",
    date: "1 month ago",
    product: "Neon Gel Show Plates",
  },
  {
    name: "David K.",
    rating: 5,
    text: "Super easy plate builder, great prices, and the plates arrived next day. Will definitely be ordering again.",
    date: "3 weeks ago",
    product: "4D 3mm Plates",
  },
  {
    name: "Mike R.",
    rating: 5,
    text: "Best quality number plates I've ever had. The 4D gel look absolutely premium. Highly recommend PlateGuy!",
    date: "1 month ago",
    product: "4D Gel Plates",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-black">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-brand-yellow/3 to-transparent" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full px-3 py-1 mb-6">
                <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
                <span className="text-brand-yellow text-xs font-semibold tracking-widest uppercase">
                  DVLA Registered Supplier
                </span>
              </div>

              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-white leading-[0.9] mb-6">
                PREMIUM
                <br />
                <span className="text-brand-yellow neon-text">NUMBER</span>
                <br />
                PLATES
              </h1>

              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                3D Gel, 4D Acrylic, Neon &amp; Bubble Plates. Expertly laser-cut
                in Leeds. Free delivery across the UK. Road legal &amp; built to last.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/plate-builder"
                  className="btn-shimmer text-brand-black font-bold px-8 py-4 rounded-xl text-base tracking-wide flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-shadow"
                >
                  DESIGN YOUR PLATES
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/plate-styles"
                  className="bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base tracking-wide hover:bg-white/10 transition-colors"
                >
                  VIEW STYLES
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  ["10,000+", "Happy Customers"],
                  ["10+", "Years Experience"],
                  ["100%", "Road Legal"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-heading text-2xl text-brand-yellow">{num}</p>
                    <p className="text-xs text-white/40">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Plate showcase */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-brand-yellow/10 blur-3xl rounded-full scale-75" />

                {/* Stacked plate previews */}
                <div className="relative space-y-4">
                  {/* Front plate (white) */}
                  <div className="transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                    <div className="bg-[#F5F5DC] rounded-lg p-4 shadow-2xl border-2 border-gray-300">
                      <div className="flex items-center gap-3">
                        {/* GB flag */}
                        <div className="flex flex-col items-center justify-center bg-[#003399] rounded-sm px-2 py-1 min-w-[32px]">
                          <div className="text-[#FFCC00] text-[8px] font-bold leading-none">GB</div>
                          <div className="mt-0.5 grid grid-cols-3 gap-[1px] w-4 h-3">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className={`rounded-[0.5px] ${[0,2,4,6,8].includes(i) ? "bg-[#FFCC00]" : "bg-transparent"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="font-black text-4xl text-black tracking-[0.15em] font-mono">
                          PG24 GUY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rear plate (yellow) */}
                  <div className="transform rotate-[1.5deg] hover:rotate-0 transition-transform duration-500 ml-8">
                    <div className="bg-[#FFA500] rounded-lg p-4 shadow-2xl border-2 border-gray-400">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center bg-[#003399] rounded-sm px-2 py-1 min-w-[32px]">
                          <div className="text-[#FFCC00] text-[8px] font-bold leading-none">GB</div>
                          <div className="mt-0.5 grid grid-cols-3 gap-[1px] w-4 h-3">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className={`rounded-[0.5px] ${[0,2,4,6,8].includes(i) ? "bg-[#FFCC00]" : "bg-transparent"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="font-black text-4xl text-black tracking-[0.15em] font-mono">
                          PG24 GUY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Neon accent plate */}
                  <div className="transform rotate-[-1deg] hover:rotate-0 transition-transform duration-500 ml-4">
                    <div
                      className="rounded-lg p-4 shadow-2xl border-2 border-purple-500/50"
                      style={{
                        background: "#0a0a0a",
                        boxShadow: "0 0 30px rgba(168,85,247,0.3), inset 0 0 20px rgba(168,85,247,0.05)",
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {Array.from("PG24GUY").map((char, i) => (
                          <span
                            key={i}
                            className="font-black text-4xl tracking-wide font-mono"
                            style={{
                              color: ["#ff0080", "#ff8000", "#ffff00", "#00ff80", "#00ffff", "#8000ff", "#ff0080"][i % 7],
                              textShadow: `0 0 10px currentColor, 0 0 20px currentColor`,
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating tags */}
                <div className="absolute -right-4 top-4 bg-brand-yellow text-brand-black text-xs font-bold px-3 py-1.5 rounded-full rotate-12">
                  4D ACRYLIC
                </div>
                <div className="absolute -left-4 bottom-8 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full -rotate-6">
                  NEON GEL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Plate Styles Grid */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                Our Collection
              </p>
              <h2 className="font-heading text-5xl sm:text-6xl text-white leading-none">
                EXPLORE OUR
                <br />
                PLATE STYLES
              </h2>
            </div>
            <Link
              href="/plate-styles"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-yellow hover:gap-3 transition-all"
            >
              VIEW ALL <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plateStyles.map((plate) => (
              <PlateCard key={plate.href} {...plate} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/plate-styles"
              className="inline-flex items-center gap-2 border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-yellow/5 transition-colors"
            >
              SHOP ALL STYLES <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Plate Comparison Section */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Buyer's Guide
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl text-white leading-none mb-4">
              WHICH PLATE IS
              <br />
              RIGHT FOR YOU?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              All our plates are fully road legal and meet DVLA BS AU 145e
              standards. Here&apos;s what makes each style unique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparison.map((item) => (
              <div
                key={item.type}
                className={`relative bg-gradient-to-b ${item.color} border ${item.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300`}
              >
                <h3 className={`font-heading text-2xl ${item.accent} mb-4 tracking-wide`}>
                  {item.type}
                </h3>

                {/* Plate preview */}
                <div className="bg-black/20 rounded-xl p-3 mb-4 aspect-video flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageSrc}
                    alt={item.type}
                    className="max-h-full object-contain"
                  />
                </div>

                <ul className="space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.accent} bg-current flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/plate-builder"
                  className={`mt-5 block text-center py-2.5 rounded-lg text-xs font-bold tracking-widest border ${item.border} ${item.accent} hover:bg-white/5 transition-colors`}
                >
                  BUILD THIS STYLE
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plate Builder CTA */}
      <section className="py-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/5 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,215,0,0.5), rgba(255,215,0,0.5) 1px, transparent 1px, transparent 20px)",
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Ready to Order?
          </p>
          <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-white leading-none mb-6">
            DESIGN YOUR
            <br />
            <span className="text-brand-yellow">PERFECT PLATE</span>
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Use our easy plate builder to design your custom number plates. Choose
            your style, size, and finish. Preview before you buy.
          </p>
          <Link
            href="/plate-builder"
            className="btn-shimmer text-brand-black font-bold px-12 py-5 rounded-xl text-lg tracking-wide inline-flex items-center gap-3 hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-shadow"
          >
            OPEN PLATE BUILDER
            <ArrowRight size={20} />
          </Link>
          <p className="text-white/30 text-xs mt-4">
            Free delivery • Free fixing kit • Road legal guarantee
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Testimonials
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl text-white leading-none">
              CUSTOMER REVIEWS
            </h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-brand-yellow fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-white/60 text-sm ml-2">5.0 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-brand-gray border border-white/5 rounded-2xl p-5 hover:border-brand-yellow/20 transition-colors group"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-brand-yellow fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-brand-yellow/70">{review.product}</p>
                  <p className="text-xs text-white/30 mt-0.5">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / SEO Content */}
      <section className="py-16 bg-brand-black border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-white mb-6">
            Buy Premium Number Plates with Plate Guy
          </h2>
          <div className="prose prose-sm prose-invert text-white/50 leading-relaxed space-y-4">
            <p>
              Are you looking for high-quality 3D Gel or 4D number plates? Or perhaps you
              just need standard replacement number plates? Look no further — PlateGuy is
              here to serve you! While we&apos;re based in Leeds, the heart of Yorkshire, we
              offer nationwide service, ensuring that everyone can benefit from our premium
              number plates.
            </p>
            <p>
              We operate Monday to Friday, 9:00am to 5:00pm, and we&apos;re the go-to choice
              for number plates across the UK. Our expertise in number plate design, combined
              with over 10 years of experience, makes Plate Guy the top choice for premium
              number plates.
            </p>
            <p>
              As a trusted, DVLA-registered number plate supplier, Plate Guy has provided
              high-quality plates to thousands of satisfied customers. We specialise in both
              3D Gel and 4D number plates, as well as the latest &quot;Bubble Plates&quot;, all fully
              compliant with DVLA regulations and BS AU 145e standards, ensuring they&apos;re
              road-legal and built to last.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
