import Link from "next/link";
import { MessageCircle, HelpCircle, Info, FileText, ChevronRight, Phone, Mail, Clock } from "lucide-react";

const helpCards = [
  {
    icon: MessageCircle,
    title: "Contact Us",
    description: "Get in touch with our friendly team. We're available Mon–Fri 9am–5pm.",
    href: "/help/contact",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Find answers to the most common questions about our plates and ordering process.",
    href: "/help/faqs",
    color: "text-brand-yellow",
    bg: "bg-brand-yellow/10",
    border: "border-brand-yellow/20",
  },
  {
    icon: Info,
    title: "About Us",
    description: "Learn more about PlateGuy, our story, and why we're the UK's top plate supplier.",
    href: "/help/about",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Required documents for ordering road legal number plates from us.",
    href: "/help/documents",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
];

const faqs = [
  {
    q: "Are your plates road legal?",
    a: "Yes, all our number plates are fully road legal and comply with DVLA regulations and BS AU 145e standards. Show plates are clearly marked and not for road use.",
  },
  {
    q: "What documents do I need to provide?",
    a: "To order road legal plates, you'll need to provide proof of identity (driving licence or passport) and proof of entitlement to the registration (V5C logbook or new keeper slip).",
  },
  {
    q: "How long does delivery take?",
    a: "We aim to dispatch all orders within 1–2 business days. Standard delivery typically takes 2–3 business days. All orders include free tracked delivery.",
  },
  {
    q: "What is the difference between 3D and 4D plates?",
    a: "3D plates use gel resin characters that have a rounded, domed appearance. 4D plates use solid laser-cut acrylic characters with a flat top, giving a bolder, more striking look in 3mm or 5mm depths.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes! All our plates come with a 3-year warranty against manufacturing defects. Our plates are UV resistant and won't fade in the sun.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, once your order is dispatched you'll receive an email with a tracking number so you can follow your delivery.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Support
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none mb-4">
            HELP CENTRE
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Everything you need to know about ordering from PlateGuy. Can&apos;t find an answer?
            Our team is always happy to help.
          </p>
        </div>
      </section>

      {/* Help Cards */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {helpCards.map(({ icon: Icon, title, description, href, color, bg, border }) => (
              <Link key={href} href={href} className="group">
                <div
                  className={`bg-brand-dark border ${border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={color} />
                  </div>
                  <h2 className={`font-heading text-2xl text-white group-hover:${color} transition-colors mb-2`}>
                    {title}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{description}</p>
                  <span className={`text-sm ${color} font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    Learn more <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Common Questions
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl text-white leading-none">
              FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="bg-brand-gray border border-white/5 rounded-xl p-5 hover:border-brand-yellow/20 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">{q}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/help/faqs"
              className="text-brand-yellow font-semibold text-sm hover:underline flex items-center gap-1 justify-center"
            >
              View all FAQs <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl p-8">
            <h2 className="font-heading text-3xl text-white mb-6 text-center">
              STILL NEED HELP?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-brand-yellow" />
                </div>
                <p className="text-sm font-semibold text-white">Call Us</p>
                <a href="tel:07387575050" className="text-sm text-brand-yellow hover:underline">
                  07387 575050
                </a>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-brand-yellow" />
                </div>
                <p className="text-sm font-semibold text-white">Email Us</p>
                <a href="mailto:info@plateguy.co.uk" className="text-sm text-brand-yellow hover:underline">
                  info@plateguy.co.uk
                </a>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-brand-yellow" />
                </div>
                <p className="text-sm font-semibold text-white">Hours</p>
                <p className="text-sm text-white/50">Mon–Fri: 9am–5pm</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
