/**
 * src/components/pages/commonSharedComponents/FooterCommonSharedComponent.tsx
 * Shared Footer — theme-aware (dark / light).
 * Reads logo theme dynamically from ThemeProvider so it matches whatever
 * the user has toggled.
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import StrixmindLogo from "@/components/ui/StrixmindLogo";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

type LinkItem = { label: string; href: string };
type Column = { heading: string; links: LinkItem[] };

interface FooterProps {
  tagline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  statusLabel?: string;
  columns?: Column[];
  socials?: LinkItem[];
  bottomText?: string;
}

const DEFAULTS = CONTENT_DEFAULTS["global.footer"] as Required<FooterProps>;

export default function FooterCommonSharedComponent({
  tagline = DEFAULTS.tagline,
  ctaLabel = DEFAULTS.ctaLabel,
  ctaHref = DEFAULTS.ctaHref,
  statusLabel = DEFAULTS.statusLabel,
  columns = DEFAULTS.columns,
  socials = DEFAULTS.socials,
  bottomText = DEFAULTS.bottomText,
}: FooterProps) {
  const { theme } = useTheme();

  // Which accordion sections are open (mobile only — desktop shows all columns expanded)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (heading: string) => {
    setOpenSections((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  return (
    <footer className="relative pt-10 sm:pt-14 border-t border-white/10 bg-[#0b0b0f] overflow-hidden">
      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-2 to-accent" />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        {/* CTA / status strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <Link href="/" className="inline-flex items-center no-underline mb-3">
              <StrixmindLogo size={28} variant="full" theme="dark" />
            </Link>
            <p className="text-sm text-white/50 leading-[1.85] max-w-[320px]">{tagline}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {statusLabel}
            </div>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex self-start sm:self-auto text-sm font-bold text-white bg-gradient-to-br from-accent to-accent-2 px-6 py-2.5 rounded-full no-underline shadow-[0_8px_24px_var(--shadow-strong)] hover:shadow-[0_10px_30px_var(--shadow-strong)] hover:-translate-y-0.5 transition-all"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Accordion / column link sections (GoDaddy-style: collapsible on mobile, open columns on desktop) */}
        <div className="py-2 sm:py-8 divide-y divide-white/10 sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {columns.map((col) => {
            const isOpen = !!openSections[col.heading];
            return (
              <div key={col.heading} className="sm:!block">
                {/* Mobile accordion header */}
                <button
                  type="button"
                  onClick={() => toggleSection(col.heading)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 sm:py-0 sm:pointer-events-none text-left"
                >
                  <span className="text-base sm:text-[0.7rem] font-bold sm:font-bold tracking-[0.02em] sm:tracking-[0.14em] sm:uppercase text-white sm:text-white/40 sm:mb-5">
                    {col.heading}
                  </span>
                  <span className="text-2xl leading-none text-white/70 sm:hidden">{isOpen ? "\u2212" : "+"}</span>
                </button>

                {/* Links — collapsible on mobile, always visible on desktop */}
                <div className={`${isOpen ? "flex" : "hidden"} sm:flex flex-col gap-3 pb-5 sm:pb-0 sm:mt-4`}>
                  {col.links.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-white/50 hover:text-accent transition-colors no-underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Logo + region/social row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-8 border-t border-white/10">
          <Link href="/" className="inline-flex items-center no-underline">
            <StrixmindLogo size={30} variant="full" theme="dark" />
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.8rem] text-white/50 hover:text-accent transition-colors no-underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 py-6 border-t border-white/10 text-center">
          <p className="text-[0.75rem] text-white/35 leading-relaxed">{bottomText}</p>
        </div>
      </div>
    </footer>
  );
}
