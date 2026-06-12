"use client";
import Link from "next/link";

export default function CtaBannerHomePageSection() {
  return (
    <section style={{ background: "#051A1C", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
      {/* BG glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(10,92,104,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#5eead4", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "2rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#14b8a6", display: "inline-block" }} />
          14-day free trial · No credit card required
        </div>

        <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
          Start automating your<br />business today.
        </h2>
        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2.75rem", maxWidth: 480, margin: "0 auto 2.75rem" }}>
          Join 500+ businesses across India using StrixMind to generate more leads, close more deals, and grow without limits.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" as const }}>
          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "#0A5C68", padding: "1rem 2.75rem", borderRadius: 100, textDecoration: "none", boxShadow: "0 0 40px rgba(10,92,104,0.5)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Start Free Trial →
          </Link>
          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", padding: "1rem 2.75rem", borderRadius: 100, textDecoration: "none" }}>
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
