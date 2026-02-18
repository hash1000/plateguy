"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "PLATE BUILDER", href: "/plate-builder" },
  {
    label: "PLATE STYLES",
    href: "/plate-styles",
    children: [
      {
        group: "4D",
        items: [
          { label: "4D 3MM Number Plates", href: "/plate-styles/4d-3mm" },
          { label: "4D 5MM Number Plates", href: "/plate-styles/4d-5mm" },
          { label: "4D Gel 3mm Number Plates", href: "/plate-styles/4d-gel-3mm" },
          { label: "4D Gel 5mm Number Plates", href: "/plate-styles/4d-gel-5mm" },
        ],
      },
      {
        group: "Neon",
        items: [
          { label: "Neon 4D Number Plates", href: "/plate-styles/neon-4d" },
          { label: "4D Neon Gel Show Plates", href: "/plate-styles/neon-gel" },
        ],
      },
      {
        group: "More Styles",
        items: [
          { label: "Printed Plates", href: "/plate-styles/printed" },
          { label: "3D Number Plates", href: "/plate-styles/3d" },
          { label: "Bubble Plates", href: "/plate-styles/bubble" },
          { label: "All Plate Styles", href: "/plate-styles" },
        ],
      },
    ],
  },
  {
    label: "HELP",
    href: "/help",
    children: [
      {
        group: "Support",
        items: [
          { label: "Contact Us", href: "/help/contact" },
          { label: "FAQs", href: "/help/faqs" },
          { label: "About", href: "/help/about" },
          { label: "Documents", href: "/help/documents" },
        ],
      },
    ],
  },
  { label: "TIKTOK", href: "https://tiktok.com", external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-black/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5"
          : "bg-brand-dark border-b border-white/5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-brand-yellow rounded-lg flex items-center justify-center font-heading text-brand-black text-xl lg:text-2xl leading-none group-hover:scale-105 transition-transform duration-200">
                PG
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-yellow rounded-full opacity-60 group-hover:scale-150 transition-transform duration-300" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-2xl lg:text-3xl text-white leading-none tracking-wide">
                PLATE<span className="text-brand-yellow">GUY</span>
              </span>
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase leading-none mt-0.5">
                Premium Number Plates
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors duration-200 tracking-wide">
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-0 pt-2 z-50">
                      <div className="bg-brand-gray border border-white/10 rounded-xl shadow-2xl p-4 min-w-[280px]">
                        {link.children.map((group) => (
                          <div key={group.group} className="mb-4 last:mb-0">
                            <p className="text-[10px] font-bold text-brand-yellow tracking-[0.2em] uppercase mb-2 px-2">
                              {group.group}
                            </p>
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-2 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-yellow text-brand-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Build CTA (desktop) */}
            <Link
              href="/plate-builder"
              className="hidden lg:flex items-center gap-2 bg-brand-yellow text-brand-black px-4 py-2 rounded-lg text-sm font-bold tracking-wide hover:bg-brand-yellow-dark transition-colors duration-200 ml-2"
            >
              BUILD NOW
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/5 py-3">
            <div className="relative max-w-2xl mx-auto">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                autoFocus
                type="text"
                placeholder="Search number plates..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-dark border-t border-white/5 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm font-semibold text-white/80 hover:text-brand-yellow border-b border-white/5 tracking-wide"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children?.map((group) =>
                  group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 pl-4 text-sm text-white/50 hover:text-white border-b border-white/5 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                )}
              </div>
            ))}
            <div className="pt-4">
              <Link
                href="/plate-builder"
                className="block w-full text-center bg-brand-yellow text-brand-black py-3 rounded-lg font-bold tracking-wide"
                onClick={() => setMobileOpen(false)}
              >
                BUILD YOUR PLATES NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
