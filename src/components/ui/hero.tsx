/**
 * src/components/ui/hero.tsx
 * ─────────────────────────────────────────────────────────────
 * PremiumHero — Shader canvas hero.
 *
 * Design: organic blob gradient background (canvas 2D, no WebGL),
 * mouse-reactive, with a three-line mixed-weight headline:
 *   line 1 → teal / light weight     (Inter 300)
 *   line 2 → bold white              (Inter 900)
 *   line 3 → italic serif / dimmed   (Instrument Serif italic)
 *
 * Fonts: Inter (font-body) + Instrument Serif (font-accent) —
 * both already loaded by layout.tsx via next/font.
 *
 * Theme-aware: dark uses deep teal/orange blobs on near-black;
 * light shifts the canvas backdrop to warm cream and adjusts
 * text to ink, keeping the same accent teal/orange family.
 * ─────────────────────────────────────────────────────────────
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

/* ── Blob config — matches the shader-hero reference exactly ── */
interface Blob {
  color: string;
  baseX: number; baseY: number;
  r: number;
  sx: number; sy: number;
  speed: number;
  phase: number;
}

const DARK_BLOBS: Blob[] = [
  { color: "#0f3d3a", baseX: 0.18, baseY: 0.35, r: 0.55, sx: 0.10, sy: 0.08, speed: 0.4,  phase: 0   },
  { color: "#2dd4bf", baseX: 0.30, baseY: 0.20, r: 0.30, sx: 0.08, sy: 0.10, speed: 0.55, phase: 1.3 },
  { color: "#f0b27a", baseX: 0.60, baseY: 0.62, r: 0.42, sx: 0.12, sy: 0.09, speed: 0.35, phase: 2.6 },
  { color: "#7dd3c0", baseX: 0.75, baseY: 0.30, r: 0.45, sx: 0.07, sy: 0.11, speed: 0.45, phase: 4.1 },
  { color: "#0a0a0a", baseX: 0.05, baseY: 0.85, r: 0.50, sx: 0.05, sy: 0.05, speed: 0.3,  phase: 5.0 },
];

const LIGHT_BLOBS: Blob[] = [
  { color: "#a7f3d0", baseX: 0.18, baseY: 0.35, r: 0.55, sx: 0.10, sy: 0.08, speed: 0.4,  phase: 0   },
  { color: "#5eead4", baseX: 0.30, baseY: 0.20, r: 0.30, sx: 0.08, sy: 0.10, speed: 0.55, phase: 1.3 },
  { color: "#fed7aa", baseX: 0.60, baseY: 0.62, r: 0.42, sx: 0.12, sy: 0.09, speed: 0.35, phase: 2.6 },
  { color: "#99f6e4", baseX: 0.75, baseY: 0.30, r: 0.45, sx: 0.07, sy: 0.11, speed: 0.45, phase: 4.1 },
  { color: "#f3f0e9", baseX: 0.05, baseY: 0.85, r: 0.50, sx: 0.05, sy: 0.05, speed: 0.3,  phase: 5.0 },
];

/* ── Props ── */
export interface PremiumHeroProps {
  /** First headline line — displayed in teal, light weight */
  lineAccent?: string;
  /** Second headline line — bold white */
  lineBold?: string;
  /** Third headline line — italic Instrument Serif, dimmed */
  lineSerif?: string;
  /** Subheadline paragraph */
  subheadline?: string;
  /** Badge pill label */
  badge?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  // Legacy single-string props kept for backward compatibility
  headline?: string;
  highlight?: string;
}

export const PremiumHero = ({
  lineAccent    = "Your Business,",
  lineBold      = "Running on",
  lineSerif     = "AI.",
  subheadline   = "Automate repetitive work, manage customer relationships, and grow faster with intelligent automation built for Indian businesses.",
  badge         = "✦  AI-powered · WhatsApp · CRM",
  primaryCtaLabel   = "Start Free Trial",
  primaryCtaHref    = "/booking",
  secondaryCtaLabel = "Book a Demo",
  secondaryCtaHref  = "/#contact",
}: PremiumHeroProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  /* ── Side-arrow section navigation ──
   * Walks through the homepage's main sections in order. The arrows
   * scroll to the next/previous section instead of doing nothing,
   * and each button's title/aria-label names the destination so
   * it's clear where the click will take you. */
  const SECTIONS: { id: string; label: string }[] = [
    { id: "services",     label: "Features & Services" },
    { id: "why",          label: "How it works" },
    { id: "testimonials", label: "Customer stories" },
    { id: "faq",          label: "FAQ" },
    { id: "contact",      label: "Get in touch" },
  ];
  const [sectionIndex, setSectionIndex] = useState(-1); // -1 = hero itself

  const goToSection = (dir: 1 | -1) => {
    const nextIndex = Math.min(Math.max(sectionIndex + dir, -1), SECTIONS.length - 1);
    setSectionIndex(nextIndex);
    if (nextIndex === -1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(SECTIONS[nextIndex].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevLabel = sectionIndex <= -1 ? "You're at the top" : sectionIndex === 0 ? "Back to top" : SECTIONS[sectionIndex - 1].label;
  const nextLabel = sectionIndex >= SECTIONS.length - 1 ? "You're at the end" : SECTIONS[sectionIndex + 1].label;

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrapper.clientWidth;
      h = wrapper.clientHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ts: number) => {
      const time = ts * 0.0001;

      /* ── pick blob colours based on active theme ── */
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const blobs  = isDark ? DARK_BLOBS : LIGHT_BLOBS;
      const baseBg = isDark ? "#0c0c0c" : "#f0ede7";

      ctx.fillStyle = baseBg;
      ctx.fillRect(0, 0, w, h);

      ctx.filter = "blur(60px)";
      ctx.globalCompositeOperation = isDark ? "lighten" : "multiply";

      blobs.forEach((b) => {
        const x = (b.baseX + Math.sin(time * b.speed + b.phase) * b.sx) * w;
        const y = (b.baseY + Math.cos(time * b.speed * 0.8 + b.phase) * b.sy) * h;
        const r = b.r * Math.max(w, h);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";

      /* subtle vignette */
      const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, isDark ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.08)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      /* ease mouse */
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.04;
      m.y += (m.ty - m.y) * 0.04;

      rafRef.current = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - rect.left) / rect.width;
      mouseRef.current.ty = (e.clientY - rect.top)  / rect.height;
    };

    resize();
    window.addEventListener("resize", resize);
    wrapper.addEventListener("mousemove", onMouse);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      draw(0);
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      wrapper.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      {/* ── Shader canvas ── */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full"
      />

      {/* ── Dark overlay for contrast ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-start justify-center h-full"
        style={{ minHeight: "calc(100vh - 72px)", padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 6vw, 5rem)" }}
      >
        {/* Three-line headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="flex flex-col mb-7"
          style={{ lineHeight: 0.94 }}
        >
          {/* Line 1 — teal / light weight */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 5.2vw, 4rem)",
              color: "#5eead4",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {lineAccent}
          </span>

          {/* Line 2 — bold white */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 900,
              fontSize: "clamp(3.2rem, 7.5vw, 5.75rem)",
              color: "#f5f5f5",
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
            }}
          >
            {lineBold}
          </span>

          {/* Line 3 — italic Instrument Serif */}
          <span
            style={{
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              marginTop: "0.05em",
            }}
          >
            {lineSerif}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="max-w-xl mb-10 text-base sm:text-lg leading-relaxed"
          style={{ color: "rgba(255,255,255,0.80)", fontWeight: 400 }}
        >
          {subheadline}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="flex flex-wrap gap-4"
        >
          {/* Ghost */}
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <Calendar className="w-4 h-4" />
            {secondaryCtaLabel}
          </Link>

          {/* Gradient */}
          <Link
            href={primaryCtaHref}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(90deg, #38bdf8, #f97316)",
              boxShadow: "0 8px 24px -8px rgba(249,115,22,0.5)",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 30px -8px rgba(249,115,22,0.65)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(249,115,22,0.5)")}
          >
            {primaryCtaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Spinning corner badge */}
        <div
          className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center justify-center"
          aria-hidden
        >
          <div
            style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "conic-gradient(from 90deg, #38bdf8, #a78bfa, #f97316, #38bdf8)",
              animation: "spin 6s linear infinite",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 5,
                borderRadius: "50%",
                background: "#0e0e0e",
              }}
            />
          </div>
          <span
            style={{
              position: "absolute",
              fontSize: 9,
              fontWeight: 600,
              color: "#fff",
              opacity: 0.85,
              fontFamily: "var(--font-body)",
            }}
          >
            StrixMind
          </span>
        </div>
      </div>

      {/* Side nav arrows — walk through the homepage sections */}
      <button
        type="button"
        aria-label={`Previous: ${prevLabel}`}
        title={prevLabel}
        onClick={() => goToSection(-1)}
        disabled={sectionIndex <= -1}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{
          background: "rgba(20,20,20,0.55)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          fontSize: 20,
          opacity: sectionIndex <= -1 ? 0.4 : 1,
          cursor: sectionIndex <= -1 ? "default" : "pointer",
        }}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label={`Next: ${nextLabel}`}
        title={nextLabel}
        onClick={() => goToSection(1)}
        disabled={sectionIndex >= SECTIONS.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{
          background: "rgba(20,20,20,0.55)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          fontSize: 20,
          opacity: sectionIndex >= SECTIONS.length - 1 ? 0.4 : 1,
          cursor: sectionIndex >= SECTIONS.length - 1 ? "default" : "pointer",
        }}
      >
        ›
      </button>

      {/* spin keyframe — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PremiumHero;
