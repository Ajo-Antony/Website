"use client";
import Link from "next/link";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

type NavLink = { label: string; href: string };

interface HeroProps {
  navLinks?: NavLink[];
  signInLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  badge?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

const NAV_DEFAULTS = CONTENT_DEFAULTS["global.nav"] as { links: NavLink[]; signInLabel: string; ctaLabel: string; ctaHref: string };
const HERO_DEFAULTS = CONTENT_DEFAULTS["home.hero"] as unknown as ContentDefaultsHero;
interface ContentDefaultsHero {
  badge: string; headline: string; subheadline: string;
  primaryCtaLabel: string; primaryCtaHref: string; secondaryCtaLabel: string; secondaryCtaHref: string;
}

export default function HeroHomePageSection({
  navLinks = NAV_DEFAULTS.links,
  signInLabel = NAV_DEFAULTS.signInLabel,
  ctaLabel = NAV_DEFAULTS.ctaLabel,
  ctaHref = NAV_DEFAULTS.ctaHref,
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
      style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "linear-gradient(160deg,#f7f6fd 0%,#eef0fb 55%,#e8e4fb 100%)" }}
    >
      {/* Animated canvas node network */}
      <canvas
        id="strix-hero-canvas"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.55, pointerEvents: "none" }}
      />

      {/* BG gradient blobs */}
      <div
        data-strix-parallax="0.15"
        style={{ position: "absolute", top: "8%", right: "8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.16) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}
      />
      <div
        data-strix-parallax="0.08"
        style={{ position: "absolute", bottom: "5%", left: "5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.13) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }}
      />

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 1, pointerEvents: "none" }} />

      {/* Navbar (homepage-only embedded copy — kept in sync with the shared
          navbar via the same global.nav content, see page.tsx) */}
      <nav
        data-strix-nav
        className="backdrop-blur-xl"
        style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(108,99,255,0.08)", transition: "all 0.4s ease" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#6c63ff,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(108,99,255,0.35)" }}>
            <StrixmindIcon size={26} theme="dark" />
          </div>
          <span data-strix-logo-text style={{ fontWeight: 800, color: "#1a1333", letterSpacing: "-0.04em", fontSize: "1.1rem", transition: "opacity 0.4s ease" }}>
            strix<span style={{ color: "#6c63ff" }}>mind</span>
          </span>
        </Link>

        <div className="hidden lg:flex" style={{ alignItems: "center", gap: "0.25rem", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 100, padding: "0.3rem 0.4rem" }}>
          {navLinks.map((l, i) => (
            <Link key={l.label} href={l.href} style={{ fontSize: "0.83rem", fontWeight: 500, color: i === 0 ? "#1a1333" : "#5b5478", textDecoration: "none", padding: "0.4rem 1rem", borderRadius: 100, background: i === 0 ? "rgba(108,99,255,0.08)" : "transparent", transition: "all 0.2s" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
          <Link href="/#contact" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5b5478", textDecoration: "none", padding: "0.55rem 1.1rem" }}>{signInLabel}</Link>
          <Link href={ctaHref} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6c63ff,#a78bfa)", textDecoration: "none", padding: "0.55rem 1.4rem", borderRadius: 100, boxShadow: "0 4px 20px rgba(108,99,255,0.4)", transition: "all 0.3s ease" }}>
            {ctaLabel}
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem 6rem" }}>

        {/* Badge */}
        <div
          data-strix-hero-badge
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.09)", border: "1px solid rgba(108,99,255,0.22)", padding: "0.4rem 1.1rem", borderRadius: 100, marginBottom: "2rem" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6c63ff", display: "inline-block", animation: "pulse 2s infinite" }} />
          {badge}
        </div>

        {/* Headline — GSAP word-split target */}
        <h1
          data-strix-hero-headline
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, color: "#1a1333", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.75rem", maxWidth: 860 }}
        >
          {headline}
        </h1>

        <p
          data-strix-hero-sub
          style={{ fontSize: "1.15rem", color: "#5b5478", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}
        >
          {subheadline}
        </p>

        <div data-strix-hero-ctas style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "5rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
          <Link href={primaryCtaHref} style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6c63ff,#a78bfa)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 12px 36px rgba(108,99,255,0.38)", transition: "all 0.3s ease" }}>
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaHref} style={{ fontSize: "1rem", fontWeight: 600, color: "#4c46c4", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(108,99,255,0.18)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease" }}>
            {secondaryCtaLabel}
          </Link>
        </div>

      </div>

      {/* Square grid pattern (Lithosquare signature) */}
      <div
        data-strix-square-grid
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 2, display: "grid", gridTemplateColumns: "repeat(60, 1fr)", pointerEvents: "none", opacity: 0.16 }}
      >
        {Array.from({ length: 240 }).map((_, i) => (
          <div
            key={i}
            data-strix-square
            style={{ aspectRatio: "1/1", border: "1px solid rgba(108,99,255,0.3)", background: "rgba(108,99,255,0.06)" }}
          />
        ))}
      </div>
    </section>
  );
}
