"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";

export default function HeroHomePageSection() {
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Fallback counter for when GSAP isn't handling it
  useEffect(() => {
    const targets = [{ val: 500 }, { val: 98 }, { val: 2 }];
    const timeout = setTimeout(() => {
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const { val } = targets[i];
        const start = performance.now();
        const update = (now: number) => {
          const p = Math.min((now - start) / 2000, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(ease * val));
          if (p < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }, 1100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="section-home"
      style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#051A1C" }}
    >
      {/* Animated canvas node network */}
      <canvas
        id="strix-hero-canvas"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.6, pointerEvents: "none" }}
      />

      {/* BG gradient blobs */}
      <div
        data-strix-parallax="0.15"
        style={{ position: "absolute", top: "10%", right: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,99,229,0.18) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}
      />
      <div
        data-strix-parallax="0.08"
        style={{ position: "absolute", bottom: "5%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,62,143,0.12) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }}
      />

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 1, pointerEvents: "none" }} />

      {/* Navbar */}
      <nav
        data-strix-nav
        style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s ease" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#051A1C", border: "1px solid rgba(0,99,229,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <StrixmindIcon size={26} theme="dark" />
          </div>
          <span data-strix-logo-text style={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", fontSize: "1.1rem", transition: "opacity 0.4s ease" }}>
            strix<span style={{ color: "#0063E5" }}>mind</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 100, padding: "0.3rem 0.4rem" }}>
          {[["Features", "#features"], ["Platform", "#demo"], ["Pricing", "#pricing"], ["Brand", "#brand"], ["Contact", "#contact"]].map(([label, href], i) => (
            <Link key={label} href={href} style={{ fontSize: "0.83rem", fontWeight: 500, color: i === 0 ? "#fff" : "rgba(255,255,255,0.6)", textDecoration: "none", padding: "0.4rem 1rem", borderRadius: 100, background: i === 0 ? "rgba(255,255,255,0.08)" : "transparent", transition: "all 0.2s" }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="#contact" style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "0.55rem 1.1rem" }}>Sign in</Link>
          <Link href="/booking" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", background: "#0063E5", textDecoration: "none", padding: "0.55rem 1.4rem", borderRadius: 100, border: "1px solid rgba(0,99,229,0.5)", boxShadow: "0 0 20px rgba(0,99,229,0.35)", transition: "all 0.3s ease" }}>
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem 6rem" }}>

        {/* Badge */}
        <div
          data-strix-hero-badge
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6aabff", background: "rgba(0,99,229,0.1)", border: "1px solid rgba(0,99,229,0.25)", padding: "0.4rem 1.1rem", borderRadius: 100, marginBottom: "2rem" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0063E5", display: "inline-block", animation: "pulse 2s infinite" }} />
          AI-Powered Business Operating System
        </div>

        {/* Headline — GSAP word-split target */}
        <h1
          data-strix-hero-headline
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.75rem", maxWidth: 860 }}
        >
          Automate Workflows. Scale Operations. Grow Without Limits.
        </h1>

        <p
          data-strix-hero-sub
          style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}
        >
          AI-powered CRM, WhatsApp automation, lead management, multi-agent workflows, and revenue intelligence — built for Indian businesses.
        </p>

        <div data-strix-hero-ctas style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "5rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "#0063E5", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 0 40px rgba(0,99,229,0.45)", transition: "all 0.3s ease" }}>
            Start Free Trial →
          </Link>
          <Link href="#demo" style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease" }}>
            Book a Demo
          </Link>
        </div>

        {/* Stats */}
        <div data-strix-hero-stats style={{ display: "flex", gap: "4rem", justifyContent: "center", flexWrap: "wrap" as const }}>
          {[
            { ref: 0, target: 500, suffix: "+", label: "Businesses automated" },
            { ref: 1, target: 98, suffix: "%", label: "Average uptime SLA" },
            { ref: 2, target: 2, suffix: " min", label: "Average setup time" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <span
                  ref={el => { statRefs.current[i] = el; }}
                  data-strix-counter={stat.target}
                >0</span>
                <span style={{ color: "#0063E5" }}>{stat.suffix}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", marginTop: "0.35rem", fontWeight: 500, letterSpacing: "0.04em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Square grid pattern (Lithosquare signature) */}
      <div
        data-strix-square-grid
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 2, display: "grid", gridTemplateColumns: "repeat(60, 1fr)", pointerEvents: "none", opacity: 0.18 }}
      >
        {Array.from({ length: 240 }).map((_, i) => (
          <div
            key={i}
            data-strix-square
            style={{ aspectRatio: "1/1", border: "1px solid rgba(0,99,229,0.4)", background: "rgba(0,99,229,0.08)" }}
          />
        ))}
      </div>
    </section>
  );
}
