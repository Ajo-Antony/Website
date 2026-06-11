"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how" },
  { label: "Why us", href: "/#why" },
  { label: "Contact", href: "/#contact" },
] as const;

export default function NavbarCommonSharedComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/8" : "border-b border-white/4"
      }`}
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className={`${spaceMono.className} text-lg font-bold tracking-tight text-white`}>
          Strix<span className="text-[#6c63ff]">Mind</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${spaceMono.className} text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/#contact"
          className={`${spaceMono.className} hidden md:inline-flex text-xs font-bold tracking-wider px-5 py-2 bg-[#6c63ff] text-white hover:opacity-85 transition-opacity`}
        >
          Get Started →
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-[22px] h-px bg-white/60" />
          <span className="block w-[22px] h-px bg-white/60" />
          <span className="block w-[22px] h-px bg-white/60" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`${spaceMono.className} text-xs tracking-widest uppercase text-white/60 py-2`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className={`${spaceMono.className} text-xs font-bold tracking-wider px-4 py-2 bg-[#6c63ff] text-white text-center`}
          >
            Get Started →
          </Link>
        </div>
      )}
    </nav>
  );
}
