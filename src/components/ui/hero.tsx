"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/shadcn-button";
import { MoveRight, PhoneCall } from "lucide-react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.08 + layer * 0.05;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  };
}

interface PremiumHeroProps {
  headline?: string;
  highlight?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export const PremiumHero = ({
  headline = "Your Business, Running on",
  highlight = "AI",
  subheadline = "Automate repetitive work, manage customer relationships, and grow faster with intelligent business automation.",
  primaryCtaLabel = "Start Free Trial",
  primaryCtaHref = "/booking",
  secondaryCtaLabel = "Book a Demo",
  secondaryCtaHref = "/#why",
}: PremiumHeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const LAYERS = 3;
  const BEAMS_PER_LAYER = 4; // was 8 — halved, same visual density at typical hero size
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  const MAX_DPR = 1.5; // was uncapped devicePixelRatio (up to 3 on some phones)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(window.innerWidth, window.innerHeight, layer));
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // StrixMind brand accent (var(--accent)) instead of the generic cyan default,
    // so the hero reads as part of the same product, not a stock template.
    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = Math.min(1, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4));
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `rgba(108,99,255,0)`);
      gradient.addColorStop(0.2, `rgba(108,99,255,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(167,139,250,${pulsingOpacity})`);
      gradient.addColorStop(0.8, `rgba(108,99,255,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `rgba(108,99,255,0)`);

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    let lastFrameTime = 0;

    const render = () => {
      if (!canvas || !ctx) return;

      // Read the active theme's bg tokens at render-time so the canvas
      // background matches both dark and light modes without re-mounting.
      const style = getComputedStyle(document.documentElement);
      const bgFrom = style.getPropertyValue("--bg-from").trim() || "#0a0816";
      const bgTo   = style.getPropertyValue("--bg-to").trim()   || "#13102b";

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, bgFrom);
      gradient.addColorStop(1, bgTo);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
        drawBeam(beam);
      });
    };

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      // Throttle to TARGET_FPS instead of running flat-out every display refresh
      if (time - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = time;
      render();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameRef.current);
      } else {
        lastFrameTime = 0;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Respect users who've asked the OS for reduced motion: draw one static frame.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      render();
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Static grain texture — replaces the old per-frame JS-generated noise canvas.
          Painted once by the browser, no JS, no per-frame CPU cost. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <div className="relative z-20 flex min-h-[calc(100vh-72px)] w-full items-center justify-center px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 sm:gap-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-[2.5rem] leading-[1.1] font-extrabold tracking-tight sm:text-5xl sm:leading-[1.08] sm:tracking-tighter md:text-7xl md:leading-[1.05]"
          >
            <span {className="text-[var(--text)]"}>{headline} </span>
            <span className="bg-gradient-to-r from-[var(--accent-2)] via-[#8b7ffc] to-[var(--accent)] bg-clip-text text-transparent">
              {highlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-base leading-relaxed tracking-tight text-[var(--text-muted)] sm:text-lg md:text-xl text-center"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="w-full gap-2 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_12px_36px_var(--shadow-strong)] hover:opacity-90 sm:w-auto"
            >
              <Link href={primaryCtaHref}>
                {primaryCtaLabel} <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full gap-2 border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--glass-bg)] sm:w-auto"
            >
              <Link href={secondaryCtaHref}>
                {secondaryCtaLabel} <PhoneCall className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PremiumHero;
