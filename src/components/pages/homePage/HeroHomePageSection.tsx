"use client";
import Link from "next/link";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconRobot, IconBriefcase, IconSprout, IconRocket } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface HeroProps {
  badge?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

const HERO_DEFAULTS = CONTENT_DEFAULTS["home.hero"] as unknown as ContentDefaultsHero;
interface ContentDefaultsHero {
  badge: string; headline: string; subheadline: string;
  primaryCtaLabel: string; primaryCtaHref: string; secondaryCtaLabel: string; secondaryCtaHref: string;
}

// Quick shortcuts shown in the hero's side rail — the pages people look
// for right after landing, each with a one-line reason to click.
const HERO_QUICK_LINKS: { href: string; label: string; desc: string; Icon: ElementType<{ size?: number; color?: string; strokeWidth?: number }> }[] = [
  { href: "/services", label: "What we automate", desc: "WhatsApp CRM, workflows & multi-agent AI", Icon: IconRobot },
  { href: "/work",     label: "See it in action",  desc: "Case studies & projects we've shipped",   Icon: IconBriefcase },
  { href: "/about",    label: "Why StrixMind",     desc: "Our values and what drives the product",  Icon: IconSprout },
  { href: "/book-meeting", label: "Book a demo",       desc: "Get a walkthrough tailored to your team", Icon: IconRocket },
];

export default function HeroHomePageSection({
  badge = HERO_DEFAULTS.badge,
  headline = HERO_DEFAULTS.headline,
  subheadline = HERO_DEFAULTS.subheadline,
  primaryCtaLabel = HERO_DEFAULTS.primaryCtaLabel,
  primaryCtaHref = HERO_DEFAULTS.primaryCtaHref,
  secondaryCtaLabel = HERO_DEFAULTS.secondaryCtaLabel,
  secondaryCtaHref = HERO_DEFAULTS.secondaryCtaHref,
}: HeroProps) {

  return (
    <section
      id="section-home"
      style={{ position: "relative", minHeight: "calc(100vh - 72px)", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--hero-bg)" }}
    >
      <canvas id="strix-hero-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.55, pointerEvents: "none" }} />

      <div data-strix-parallax="0.15" style={{ position: "absolute", top: "8%", right: "8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, var(--border) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }} />
      <div data-strix-parallax="0.08" style={{ position: "absolute", bottom: "5%", left: "5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.13) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 2rem 7rem" }}>
        <div data-strix-hero-badge style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid rgba(108,99,255,0.22)", padding: "0.4rem 1.1rem", borderRadius: 100, marginBottom: "2rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse 2s infinite" }} />
          {badge}
        </div>

        <h1 data-strix-hero-headline style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.75rem", maxWidth: 860 }}>
          {headline}
        </h1>

        <p data-strix-hero-sub style={{ fontSize: "1.15rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}>
          {subheadline}
        </p>

        <div data-strix-hero-ctas style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={primaryCtaHref} style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 12px 36px rgba(108,99,255,0.38)", transition: "all 0.3s ease" }}>
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaHref} style={{ fontSize: "1rem", fontWeight: 600, color: "var(--accent-deep)", background: "var(--hero-glass)", border: "1px solid var(--glass-border)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease" }}>
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      {/* ── Side quick-links rail — shortcuts to the pages people usually
          look for right after landing on the hero (desktop only; the
          hero is already tight on vertical space on mobile). ── */}
      <div
        className="hidden xl:flex"
        style={{
          position: "absolute", right: "2.5rem", top: "50%", transform: "translateY(-50%)",
          zIndex: 6, flexDirection: "column", gap: "0.65rem", width: 232,
        }}
      >
        {HERO_QUICK_LINKS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            data-strix-fade-up
            data-strix-delay={0.15 + i * 0.08}
            style={{
              display: "flex", alignItems: "flex-start", gap: "0.7rem",
              padding: "0.85rem 1rem", borderRadius: "var(--radius-md)",
              background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
              backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              textDecoration: "none", transition: "all 0.25s ease",
            }}
          >
            <div style={{ width: 30, height: 30, minWidth: 30, borderRadius: "0.6rem", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <item.Icon size={15} color="#fff" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.15rem" }}>{item.label}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div data-strix-square-grid style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 2, display: "grid", gridTemplateColumns: "repeat(60, 1fr)", pointerEvents: "none", opacity: 0.16 }}>
        {Array.from({ length: 240 }).map((_, i) => (
          <div key={i} data-strix-square style={{ aspectRatio: "1/1", border: "1px solid rgba(108,99,255,0.3)", background: "var(--glass-bg)" }} />
        ))}
      </div>
    </section>
  );
}
