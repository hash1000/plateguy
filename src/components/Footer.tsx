import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All Styles", href: "/plate-styles" },
  { label: "Plate Builder", href: "/plate-builder" },
  { label: "About Us", href: "/help/about" },
];

const helpLinks = [
  { label: "Contact Us", href: "/help/contact" },
  { label: "FAQs", href: "/help/faqs" },
  { label: "Cancellation Policy", href: "/help/cancellation" },
  { label: "Refund Policy", href: "/help/refund" },
];

const plateStyles = [
  { label: "4D 3mm Number Plates", href: "/plate-styles/4d-3mm" },
  { label: "4D 5mm Number Plates", href: "/plate-styles/4d-5mm" },
  { label: "4D Gel Plates", href: "/plate-styles/4d-gel" },
  { label: "Neon 4D Plates", href: "/plate-styles/neon-4d" },
  { label: "Bubble Plates", href: "/plate-styles/bubble" },
  { label: "3D Number Plates", href: "/plate-styles/3d" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Required Documents", href: "/help/documents" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/5 mt-auto">
      {/* CTA Strip */}
      <div className="bg-brand-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading text-3xl text-brand-black leading-none">
              BUILD YOUR PLATES TODAY
            </p>
            <p className="text-brand-black/70 text-sm mt-1">
              Free delivery • Free fixing kit • 3-year warranty
            </p>
          </div>
          <Link
            href="/plate-builder"
            className="bg-brand-black text-white px-8 py-3 rounded-lg font-bold tracking-wide hover:bg-brand-gray transition-colors whitespace-nowrap"
          >
            GO TO BUILDER →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center font-heading text-brand-black text-xl">
                PG
              </div>
              <span className="font-heading text-2xl text-white">
                PLATE<span className="text-brand-yellow">GUY</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Premium number plates from Leeds, serving the whole UK. DVLA
              registered supplier with over 10 years of experience.
            </p>
            <div className="space-y-2 text-sm text-white/50">
              <a
                href="mailto:info@plateguy.co.uk"
                className="flex items-center gap-2 hover:text-brand-yellow transition-colors"
              >
                <Mail size={14} />
                info@plateguy.co.uk
              </a>
              <a
                href="tel:07387575050"
                className="flex items-center gap-2 hover:text-brand-yellow transition-colors"
              >
                <Phone size={14} />
                07387 575050
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                Leeds, Yorkshire, UK
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-white/50 hover:text-brand-yellow hover:bg-white/10 transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-white/50 hover:text-brand-yellow hover:bg-white/10 transition-all"
              >
                <Instagram size={16} />
              </a>
              {/* TikTok icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-white/50 hover:text-brand-yellow hover:bg-white/10 transition-all text-xs font-bold"
              >
                TT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-brand-yellow mb-4 tracking-wide">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plate Styles */}
          <div>
            <h4 className="font-heading text-lg text-brand-yellow mb-4 tracking-wide">
              PLATE STYLES
            </h4>
            <ul className="space-y-2">
              {plateStyles.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading text-lg text-brand-yellow mb-4 tracking-wide">
              GET IN TOUCH
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/5">
              <p className="text-xs font-semibold text-white/70 mb-1">
                Business Hours
              </p>
              <p className="text-xs text-white/40">Mon – Fri: 9:00am – 5:00pm</p>
            </div>
          </div>
        </div>

        {/* About Text */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="prose prose-sm prose-invert max-w-none text-white/30 text-xs leading-relaxed">
            <p>
              <strong className="text-white/50">Buy Premium Number Plates with Plate Guy.</strong>{" "}
              Are you looking for high-quality 3D Gel or 4D number plates? PlateGuy.co.uk is
              here to serve you! We operate Monday to Friday, 9:00am to 5:00pm, and we&apos;re
              the go-to choice for number plates across the UK. Our expertise combined with
              over 10 years of experience makes Plate Guy the top choice for premium number
              plates. As a trusted, DVLA-registered number plate supplier, Plate Guy has
              provided high-quality plates to thousands of satisfied customers. We specialise
              in 3D Gel, 4D, and Bubble Plates, all fully compliant with DVLA regulations and
              BS AU 145e standards.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2024 PlateGuy Limited. All rights reserved. DVLA is a registered trade mark of the
            Driver & Vehicle Licensing Agency. Plateguy is not affiliated with the DVLA.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
