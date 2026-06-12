"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroHomePageSection() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const targets = [{ val: 500, suffix: "+" }, { val: 98, suffix: "%" }, { val: 2, suffix: "min" }];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const { val } = targets[i];
      const start = performance.now();
      const update = (now: number) => {
        const p = Math.min((now - start) / 1800, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(ease * val));
        if (p < 1) requestAnimationFrame(update);
      };
      setTimeout(() => requestAnimationFrame(update), 500 + i * 200);
    });
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#051A1C" }}>
      {/* BG gradient mesh */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(10,92,104,0.35) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(20,184,166,0.15) 0%, transparent 60%)", zIndex: 0 }} />
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0A5C68", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9 L9 4 L14 9 L9 14 Z" fill="white" opacity="0.9"/><path d="M6.5 9 L9 6.5 L11.5 9 L9 11.5 Z" fill="#14b8a6"/></svg>
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>StrixMind</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "0.3rem 0.4rem" }}>
          {[["Features", "#features"], ["Platform", "#demo"], ["Pricing", "#pricing"], ["FAQ", "#faq"], ["Contact", "#contact"]].map(([label, href], i) => (
            <Link key={label} href={href} style={{ fontSize: "0.83rem", fontWeight: 500, color: i === 0 ? "#fff" : "rgba(255,255,255,0.65)", textDecoration: "none", padding: "0.4rem 1rem", borderRadius: 100, background: i === 0 ? "rgba(255,255,255,0.1)" : "transparent", transition: "all 0.2s" }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/booking" style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "0.55rem 1.1rem" }}>Sign in</Link>
          <Link href="/booking" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", background: "#0A5C68", textDecoration: "none", padding: "0.55rem 1.35rem", borderRadius: 100, border: "1px solid rgba(255,255,255,0.15)" }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem 6rem" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "#5eead4", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "2rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#14b8a6", display: "inline-block" }} />
          AI-Powered Business Operating System
        </div>

        <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.75rem", maxWidth: 860 }}>
          Automate Workflows.<br />
          <span style={{ color: "#14b8a6" }}>Scale Operations.</span><br />
          Grow Without Limits.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: 560 }}>
          AI-powered CRM, WhatsApp automation, lead management, multi-agent workflows, and revenue intelligence — all in one platform built for Indian businesses.
        </p>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", background: "#0A5C68", padding: "0.95rem 2.5rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 0 32px rgba(10,92,104,0.5)" }}>
            Start Free Trial →
          </Link>
          <Link href="#demo" style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", padding: "0.95rem 2.5rem", borderRadius: 100, textDecoration: "none" }}>
            Book a Demo
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "4rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { ref: 0, suffix: "+", label: "Businesses automated" },
            { ref: 1, suffix: "%", label: "Average uptime SLA" },
            { ref: 2, suffix: " min", label: "Average setup time" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <span ref={el => { refs.current[i] = el; }}>0</span>
                <span style={{ color: "#14b8a6" }}>{stat.suffix}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginTop: "0.35rem", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "2rem", right: "3rem", zIndex: 5, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        Scroll to explore ↓
      </div>
    </section>
  );
}
