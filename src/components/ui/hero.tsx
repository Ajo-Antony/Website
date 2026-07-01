/**
 * src/components/ui/hero.tsx
 * ─────────────────────────────────────────────────────────────
 * PremiumHero — Shader canvas hero, now a slide carousel.
 *
 * Design: organic blob gradient background (canvas 2D, no WebGL),
 * mouse-reactive, with a three-line mixed-weight headline per slide:
 *   line 1 → teal / light weight     (Inter 300)
 *   line 2 → bold white              (Inter 900)
 *   line 3 → italic serif / dimmed   (Instrument Serif italic)
 *
 * Clicking the left/right arrows (or a dot) crossfades to the next/
 * previous slide — each slide has its own badge, headline, sub-copy,
 * and CTAs. Dots at bottom-left show position and are clickable.
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
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Slide content ── */
export interface HeroSlide {
  badge?: string;
  lineAccent: string;
  lineBold: string;
  lineSerif: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    badge: "✦  AI automation for Indian businesses",
    lineAccent: "Your Business,",
    lineBold: "Running on",
    lineSerif: "AI.",
    subheadline: "Automate repetitive work, manage customer relationships, and grow faster with intelligent automation built for Indian businesses.",
    primaryCtaLabel: "Start Free Trial",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Book a Demo",
    secondaryCtaHref: "/#contact",
  },
  {
    badge: "✦  WhatsApp bots that never sleep",
    lineAccent: "Every Chat,",
    lineBold: "Answered on",
    lineSerif: "WhatsApp.",
    subheadline: "Deploy intelligent bots that handle bookings, FAQs, and follow-ups 24/7 — in any Indian language, without hiring a support team.",
    primaryCtaLabel: "Start Free Trial",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "See it in action",
    secondaryCtaHref: "/#services",
  },
  {
    badge: "✦  One CRM that updates itself",
    lineAccent: "Stop Chasing,",
    lineBold: "Start Closing",
    lineSerif: "Deals.",
    subheadline: "AI enriches contacts, scores your pipeline, and surfaces the follow-ups that actually move revenue — every single day.",
    primaryCtaLabel: "Start Free Trial",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Book a Demo",
    secondaryCtaHref: "/#contact",
  },
];

export interface PremiumHeroProps {
  /** Slides to cycle through with the arrow / dot navigation. */
  slides?: HeroSlide[];
}

export const PremiumHero = ({ slides = DEFAULT_SLIDES }: PremiumHeroProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  /* ── Slide carousel state ── */
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const slide = slides[slideIndex];

  const goTo = (index: number, dir: 1 | -1) => {
    setDirection(dir);
    setSlideIndex(((index % slides.length) + slides.length) % slides.length);
  };
  const goPrev = () => goTo(slideIndex - 1, -1);
  const goNext = () => goTo(slideIndex + 1, 1);

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

      {/* ── Content — crossfades between slides ── */}
      <div
        className="relative z-10 flex flex-col items-start justify-center h-full"
        style={{ minHeight: "calc(100vh - 72px)", padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 6vw, 5rem)" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slideIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Badge */}
            {slide.badge && (
              <div
                className="inline-flex items-center gap-2 rounded-full border text-sm font-medium mb-8 px-4 py-2"
                style={{
                  background: "rgba(20,20,20,0.55)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                <span style={{ color: "#a78bfa" }}>✦</span>
                {slide.badge.replace(/^✦\s*/, "")}
              </div>
            )}

            {/* Three-line headline */}
            <h1 className="flex flex-col mb-7" style={{ lineHeight: 0.94 }}>
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
                {slide.lineAccent}
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
                {slide.lineBold}
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
                {slide.lineSerif}
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="max-w-xl mb-10 text-base sm:text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.80)", fontWeight: 400 }}
            >
              {slide.subheadline}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
              {/* Ghost */}
              <Link
                href={slide.secondaryCtaHref}
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
                {slide.secondaryCtaLabel}
              </Link>

              {/* Gradient */}
              <Link
                href={slide.primaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #f97316)",
                  boxShadow: "0 8px 24px -8px rgba(249,115,22,0.5)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 30px -8px rgba(249,115,22,0.65)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(249,115,22,0.5)")}
              >
                {slide.primaryCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide dot indicators */}
        {slides.length > 1 && (
          <div className="flex items-center gap-2 mt-10" role="tablist" aria-label="Hero slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === slideIndex}
                onClick={() => goTo(i, i > slideIndex ? 1 : -1)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === slideIndex ? 22 : 8,
                  height: 8,
                  background: i === slideIndex ? "#fff" : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

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

      {/* Side nav arrows — move to the next/previous slide */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: "rgba(20,20,20,0.55)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: 20,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: "rgba(20,20,20,0.55)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: 20,
            }}
          >
            ›
          </button>
        </>
      )}

      {/* spin keyframe — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PremiumHero;
