"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    category: "Ordering",
    faqs: [
      {
        q: "How do I order number plates?",
        a: "Simply use our online Plate Builder to customise your plates. Select your style, enter your registration, choose your size and options, then add to basket and checkout. It's quick and easy!",
      },
      {
        q: "What documents do I need to provide for road legal plates?",
        a: "For road legal plates, we require proof of identity (driving licence or passport) and proof of entitlement to the registration (V5C logbook, new keeper slip, or certificate of entitlement). You can upload these documents during checkout.",
      },
      {
        q: "Can I order show plates without documents?",
        a: "Yes! Show plates can be ordered without documents. However, these plates are strictly for display purposes only and must not be used on a road vehicle.",
      },
    ],
  },
  {
    category: "Plate Types",
    faqs: [
      {
        q: "What is the difference between 3D and 4D plates?",
        a: "3D plates feature gel resin characters that have a rounded, smooth, domed appearance. 4D plates use solid, laser-cut acrylic characters which are flat-topped and give a bolder, more striking look. 4D plates come in 3mm and 5mm depths.",
      },
      {
        q: "What are 4D Gel plates?",
        a: "4D Gel plates combine the best of both worlds. They use acrylic characters (like standard 4D) but are topped with a gel resin coating, giving them the bold depth of 4D with the smooth, domed finish of gel plates.",
      },
      {
        q: "Are Neon plates road legal?",
        a: "Our Neon plates are show plates only and are not road legal. They're perfect for car shows, events, and display purposes. We clearly mark all show plates.",
      },
      {
        q: "What are Bubble Plates?",
        a: "Bubble Plates are one of our most unique styles. They feature a distinctive shaped background plate (not the standard rectangle) combined with domed gel characters. They are fully road legal.",
      },
    ],
  },
  {
    category: "Delivery",
    faqs: [
      {
        q: "How much does delivery cost?",
        a: "Delivery is completely FREE on all orders. We also include a free fixing kit with every plate order so you can mount your plates straight away.",
      },
      {
        q: "How long will my plates take to arrive?",
        a: "We aim to dispatch all orders within 1–2 business days. Standard delivery takes 2–3 business days after dispatch. You'll receive a tracking number by email once your order ships.",
      },
      {
        q: "Do you deliver outside the UK?",
        a: "Currently we only deliver within the United Kingdom. We cover all of England, Scotland, Wales, and Northern Ireland.",
      },
    ],
  },
  {
    category: "Quality & Legal",
    faqs: [
      {
        q: "Are your plates road legal?",
        a: "Yes, all our road plates comply with DVLA regulations and BS AU 145e standards. Show plates are clearly marked and intended for display only.",
      },
      {
        q: "Do your plates come with a warranty?",
        a: "Yes! All our plates come with a 3-year warranty against manufacturing defects. Our plates are UV resistant, pressure-wash safe, and built to last.",
      },
      {
        q: "Can my plates be pressure washed?",
        a: "Yes! Our plates are designed to withstand pressure washing. The gel resin and acrylic materials are waterproof and weather resistant.",
      },
      {
        q: "Will the plates fade in sunlight?",
        a: "No. Our plates are UV resistant and designed to retain their colour and finish even after prolonged exposure to sunlight.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    faqs: [
      {
        q: "What is your returns policy?",
        a: "As our plates are custom-made to order, we can only accept returns for items that arrive damaged or with a manufacturing fault. Please contact us within 14 days of receiving your order.",
      },
      {
        q: "What if my plate arrives damaged?",
        a: "If your plate arrives damaged, please contact us immediately with photos and we'll arrange a free replacement as quickly as possible.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-brand-yellow flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-white/5">
          <p className="text-sm text-white/60 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...faqCategories.map((c) => c.category)];

  const filtered =
    activeCategory === "All"
      ? faqCategories
      : faqCategories.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Support
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none">
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-brand-yellow text-brand-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ lists */}
          <div className="space-y-10">
            {filtered.map((section) => (
              <div key={section.category}>
                <h2 className="font-heading text-2xl text-brand-yellow mb-4 tracking-wide">
                  {section.category}
                </h2>
                <div className="space-y-2">
                  {section.faqs.map(({ q, a }) => (
                    <FaqItem key={q} q={q} a={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
