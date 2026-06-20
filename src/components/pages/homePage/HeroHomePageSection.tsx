"use client";
import Link from "next/link";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

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
      style={{ position: "relative", minHeight: "calc(100vh - 72px)", display: "flex", flexDirection: "column", overflow: "hidden", background: "linear-gradient(160deg,#f7f6fd 0%,#eef0fb 55%,#e8e4fb 100%)" }}
    >
      <canvas id="strix-hero-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.55, pointerEvents: "none" }} />

      <div data-strix-parallax="0.15" style={{ position: "absolute", top: "8%", right: "8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.16) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }} />
      <div data-strix-parallax="0.08" style={{ position: "absolute", bottom: "5%", left: "5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.13) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 2rem 7rem" }}>
        <div data-strix-hero-badge style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4c46c4", background: "rgba(108,99,255,0.09)", border: "1px solid rgba(108,99,255,0.22)", padding: "0.4rem 1.1rem", borderRadius: 100, marginBottom: "2rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6c63ff", display: "inline-block", animation: "pulse 2s infinite" }} />
          {badge}
        </div>

        <h1 data-strix-hero-headline style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, color: "#1a1333", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.75rem", maxWidth: 860 }}>
          {headline}
        </h1>

        <p data-strix-hero-sub style={{ fontSize: "1.15rem", color: "#5b5478", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}>
          {subheadline}
        </p>

        <div data-strix-hero-ctas style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={primaryCtaHref} style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6c63ff,#a78bfa)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 12px 36px rgba(108,99,255,0.38)", transition: "all 0.3s ease" }}>
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaHref} style={{ fontSize: "1rem", fontWeight: 600, color: "#4c46c4", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(108,99,255,0.18)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease" }}>
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      <div data-strix-square-grid style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 2, display: "grid", gridTemplateColumns: "repeat(60, 1fr)", pointerEvents: "none", opacity: 0.16 }}>
        {Array.from({ length: 240 }).map((_, i) => (
          <div key={i} data-strix-square style={{ aspectRatio: "1/1", border: "1px solid rgba(108,99,255,0.3)", background: "rgba(108,99,255,0.06)" }} />
        ))}
      </div>
    </section>
  );
}
