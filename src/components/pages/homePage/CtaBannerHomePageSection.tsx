"use client";
import Link from "next/link";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface CtaProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

const D = CONTENT_DEFAULTS["home.cta"] as Required<CtaProps>;

export default function CtaBannerHomePageSection({
  badge = D.badge,
  heading = D.heading,
  subheading = D.subheading,
  primaryCtaLabel = D.primaryCtaLabel,
  primaryCtaHref = D.primaryCtaHref,
  secondaryCtaLabel = D.secondaryCtaLabel,
  secondaryCtaHref = D.secondaryCtaHref,
}: CtaProps) {
  return (
    <section style={{ background: "linear-gradient(135deg,#6c63ff 0%,#8b7cf6 50%,#a78bfa 100%)", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
      {/* Animated aurora glow — replaces the old static radial+grid overlay */}
      <AuroraBackground className="absolute inset-0 pointer-events-none" showRadialGradient={false} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#fff", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "2rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
          {badge}
        </div>

        <h2 data-strix-slide-up style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: "1.5rem", whiteSpace: "pre-line" }}>
          {heading}
        </h2>
        <p data-strix-fade-up style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.75, marginBottom: "2.75rem", maxWidth: 480, margin: "0 auto 2.75rem" }}>
          {subheading}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" as const }}>
          <Link href={primaryCtaHref} style={{ fontSize: "1rem", fontWeight: 700, color: "#6c63ff", background: "#fff", padding: "1rem 2.75rem", borderRadius: 100, textDecoration: "none", boxShadow: "0 12px 36px rgba(0,0,0,0.18)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaHref} style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.4)", padding: "1rem 2.75rem", borderRadius: 100, textDecoration: "none" }}>
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
