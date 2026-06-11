"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroHomePageSection() {
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const target = 2.1;
    const start = performance.now();
    const update = (now: number) => {
      const p = Math.min((now - start) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = (ease * target).toFixed(1);
      if (p < 1) requestAnimationFrame(update);
    };
    setTimeout(() => requestAnimationFrame(update), 400);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Background image layer */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
      }} />
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(5,18,20,0.55) 0%, rgba(5,18,20,0.70) 100%)",
        zIndex: 1,
      }} />

      {/* Navbar */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5rem 2.5rem",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4 L11 2 L18 4 L18 11 Q18 18 11 21 Q4 18 4 11 Z" fill="rgba(255,255,255,0.9)" />
            <path d="M8 11 L11 8 L14 11 L11 14 Z" fill="#0A5C68" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Vort</span>
        </div>

        {/* Center pill nav */}
        <div style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 100,
          padding: "0.35rem 0.5rem",
          display: "flex", alignItems: "center", gap: "0.15rem",
          boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
        }}>
          {["Home", "About Us", "Investment Criteria", "Portfolio"].map((label, i) => (
            <Link
              key={label}
              href={`/${i === 0 ? "" : label.toLowerCase().replace(/ /g, "-")}`}
              style={{
                fontSize: "0.82rem", fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? "#fff" : "#374151",
                textDecoration: "none",
                padding: "0.45rem 1rem",
                borderRadius: 100,
                background: i === 0 ? "#0A5C68" : "transparent",
                transition: "background 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA button */}
        <Link href="/contact" style={{
          fontSize: "0.85rem", fontWeight: 600,
          color: "#fff",
          background: "#0A5C68",
          padding: "0.6rem 1.4rem",
          borderRadius: 100,
          textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          border: "1.5px solid rgba(255,255,255,0.15)",
        }}>
          Get In Touch →
        </Link>
      </nav>

      {/* Hero content */}
      <div style={{
        position: "relative", zIndex: 5,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 2.5rem 3rem",
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        alignSelf: "stretch",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Left: headline + sub + buttons */}
          <div style={{ maxWidth: 600 }}>
            <h1 style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 1.25rem",
            }}>
              Building Long-Term Value<br />In Uncertain Markets
            </h1>
            <p style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              margin: "0 0 2rem",
              maxWidth: 420,
            }}>
              We invest with conviction, insight, and discipline — partnering with exceptional leaders to create lasting impact across evolving industries.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Link href="/contact" style={{
                fontSize: "0.9rem", fontWeight: 600,
                color: "#0F172A",
                background: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: 100,
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
              }}>
                Get In Touch →
              </Link>
              <Link href="/#portfolio" style={{
                fontSize: "0.9rem", fontWeight: 500,
                color: "#fff",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "0.75rem 1.75rem",
                borderRadius: 100,
                textDecoration: "none",
                backdropFilter: "blur(8px)",
              }}>
                Our Portfolio
              </Link>
            </div>
          </div>

          {/* Right: stats card */}
          <div style={{
            background: "rgba(10,20,22,0.65)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: "1.5rem 2rem",
            minWidth: 200,
            textAlign: "left",
          }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              $<span ref={countRef}>0.0</span>+
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", marginTop: "0.4rem" }}>
              Invested across private markets
            </div>
          </div>
        </div>

        {/* Scroll to Explore */}
        <div style={{
          position: "absolute", right: "2.5rem", bottom: "3rem",
          display: "flex", alignItems: "center", gap: "0.4rem",
          fontSize: "0.78rem", color: "rgba(255,255,255,0.55)",
          fontWeight: 500, letterSpacing: "0.02em",
        }}>
          Scroll to Explore ↓
        </div>
      </div>
    </section>
  );
}
