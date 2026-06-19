/**
 * src/components/pages/commonSharedComponents/NavbarCommonSharedComponent.tsx
 * ─────────────────────────────────────────────────────────────
 * FILE PURPOSE:
 *   Shared sticky Navbar rendered on all pages EXCEPT "/" (homepage
 *   uses its own embedded nav inside HeroHomePageSection).
 *
 * BEHAVIOUR:
 *   - Transparent on page load; gains white/blur background after 60px scroll
 *   - Mobile: collapses to hamburger (✕ / ☰) with slide-down link panel
 *   - Driven by CMS key "global.nav" (links, sign-in label, CTA label/href)
 *
 * USED BY:   src/app/layout.tsx  →  <NavbarCommonSharedComponent />
 * CMS KEY:   "global.nav"  (src/lib/cms/registry.ts)
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

type NavLink = { label: string; href: string };

interface NavbarProps {
  links?: NavLink[];
  signInLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULTS = CONTENT_DEFAULTS["global.nav"] as { links: NavLink[]; signInLabel: string; ctaLabel: string; ctaHref: string };

export default function NavbarCommonSharedComponent({
  links = DEFAULTS.links,
  signInLabel = DEFAULTS.signInLabel,
  ctaLabel = DEFAULTS.ctaLabel,
  ctaHref = DEFAULTS.ctaHref,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The homepage renders its own embedded nav inside the Hero section
  // (same data-strix-nav contract) so the GSAP scroll-compress hook only
  // ever finds one navbar per page.
  if (pathname === "/") return null;

  return (
    <nav
      data-strix-nav
      data-scrolled={scrolled ? "true" : undefined}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 backdrop-blur-xl ${
        scrolled ? "bg-white/90 border-b border-line shadow-[0_4px_30px_rgba(108,99,255,0.10)]" : "bg-white/55 border-b border-white/40"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center shadow-[0_4px_14px_rgba(108,99,255,0.35)]">
            <StrixmindIcon size={20} theme="dark" />
          </div>
          <span data-strix-logo-text className="text-[1.05rem] font-extrabold text-ink tracking-tight whitespace-nowrap">
            strix<span className="text-accent">mind</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-9 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-ink-soft hover:text-ink transition-colors no-underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/#contact"
            className="text-sm font-semibold px-5 py-2 rounded-full border border-accent/30 text-accent hover:bg-accent/8 transition-colors no-underline"
          >
            {signInLabel}
          </Link>
          <Link
            href={ctaHref}
            className="text-sm font-bold px-6 py-2.5 rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_8px_24px_rgba(108,99,255,0.32)] hover:shadow-[0_10px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 transition-all no-underline"
          >
            {ctaLabel}
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-line text-ink"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-line px-6 py-5 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-soft py-2.5 no-underline">
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-3">
            <Link href="/#contact" className="flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-full border border-accent/30 text-accent no-underline">
              {signInLabel}
            </Link>
            <Link href={ctaHref} className="flex-1 text-center text-sm font-bold px-4 py-2.5 rounded-full bg-gradient-to-br from-accent to-accent-2 text-white no-underline">
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
