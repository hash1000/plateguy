import Link from "next/link";
import { Shield, Award, Users, Truck, ArrowRight } from "lucide-react";

const stats = [
  { num: "10,000+", label: "Happy Customers" },
  { num: "10+", label: "Years Experience" },
  { num: "100%", label: "Road Legal" },
  { num: "5★", label: "Average Rating" },
];

const values = [
  {
    icon: Shield,
    title: "DVLA Registered",
    desc: "We're a fully registered DVLA number plate supplier, ensuring every road legal plate meets UK legal requirements.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Using cutting-edge laser equipment and premium materials to craft plates with precision and care.",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Over 10 years of experience in number plate production. We know plates inside and out.",
  },
  {
    icon: Truck,
    title: "Fast UK Delivery",
    desc: "We serve the whole of the UK with free tracked delivery on every order, with a free fixing kit included.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero */}
      <section className="bg-brand-dark border-b border-white/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            About Us
          </p>
          <h1 className="font-heading text-6xl sm:text-7xl text-white leading-none mb-6">
            ABOUT PLATEGUY
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Leeds-based premium number plate supplier serving customers across the whole
            of the UK. Over 10 years of experience and thousands of satisfied customers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-brand-yellow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(({ num, label }) => (
              <div key={label}>
                <p className="font-heading text-4xl text-brand-black">{num}</p>
                <p className="text-brand-black/60 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                Our Story
              </p>
              <h2 className="font-heading text-4xl text-white mb-6">WHO WE ARE</h2>
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <p>
                  PlateGuy was founded in Leeds, Yorkshire, with a simple mission: to provide
                  the highest quality number plates in the UK at fair prices, with exceptional
                  customer service.
                </p>
                <p>
                  We started as a small local operation and have grown into one of the UK&apos;s most
                  trusted number plate suppliers, thanks to our commitment to quality, legality,
                  and customer satisfaction.
                </p>
                <p>
                  As a DVLA-registered supplier, we take legal compliance seriously. Every road
                  legal plate we produce meets BS AU 145e standards and DVLA regulations. We
                  verify customer identity and entitlement before producing any road legal plates.
                </p>
                <p>
                  Whether you&apos;re looking for a simple replacement set or premium 4D plates for
                  your pride and joy, we&apos;ve got the style, quality, and service to exceed your
                  expectations.
                </p>
              </div>
            </div>

            {/* Plate display */}
            <div className="relative">
              <div className="absolute inset-0 bg-brand-yellow/10 blur-3xl rounded-full" />
              <div className="relative space-y-4">
                <div className="bg-[#F5F5DC] rounded-lg p-5 shadow-2xl border-2 border-gray-300 transform -rotate-2">
                  <span className="font-black text-4xl text-black tracking-[0.15em] font-mono block text-center">
                    PLATE GUY
                  </span>
                </div>
                <div className="bg-[#FFA500] rounded-lg p-5 shadow-2xl border-2 border-gray-400 transform rotate-1 ml-8">
                  <span className="font-black text-4xl text-black tracking-[0.15em] font-mono block text-center">
                    PLATE GUY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-white">WHY CHOOSE PLATEGUY?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="text-center p-5 bg-brand-gray rounded-2xl border border-white/5 hover:border-brand-yellow/20 transition-colors"
              >
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-yellow" />
                </div>
                <h3 className="font-heading text-lg text-white mb-2">{title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-4xl text-white mb-4">READY TO ORDER?</h2>
          <p className="text-white/50 mb-6">
            Use our plate builder to design your perfect plates in minutes.
          </p>
          <Link
            href="/plate-builder"
            className="btn-shimmer text-brand-black font-bold px-10 py-4 rounded-xl tracking-wide inline-flex items-center gap-2"
          >
            BUILD YOUR PLATES <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
