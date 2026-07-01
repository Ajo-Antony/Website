/**
 * src/components/pages/commonSharedComponents/FooterCommonSharedComponent.tsx
 * Shared Footer — theme-aware (dark / light).
 * Reads logo theme dynamically from ThemeProvider so it matches whatever
 * the user has toggled.
 */
"use client";
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

  return (
    <footer
      className="relative pt-20 border-t border-line overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--bg-from) 0%, var(--surface-alt) 100%)" }}
    >
      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-2 to-accent" />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10 lg:gap-12 pb-16 border-b border-line">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center no-underline mb-5">
              <StrixmindLogo size={30} variant="full" theme={theme} />
            </Link>

            <p className="text-sm text-ink-soft leading-[1.85] mb-6 max-w-[240px]">{tagline}</p>

            <div className="flex items-center gap-2 mb-5 text-xs text-ink-dim">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {statusLabel}
            </div>

            <Link
              href={ctaHref}
              className="inline-flex text-sm font-bold text-white bg-gradient-to-br from-accent to-accent-2 px-6 py-2.5 rounded-full no-underline shadow-[0_8px_24px_var(--shadow-strong)] hover:shadow-[0_10px_30px_var(--shadow-strong)] hover:-translate-y-0.5 transition-all"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <div className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-ink-dim mb-5">{col.heading}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((item) => (
                  <Link key={item.label} href={item.href} className="text-sm text-ink-soft hover:text-accent transition-colors no-underline">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-7">
          <div className="text-[0.8rem] text-ink-dim">
            {bottomText}
          </div>
          <div className="flex gap-6">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[0.8rem] text-ink-dim hover:text-accent transition-colors no-underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
