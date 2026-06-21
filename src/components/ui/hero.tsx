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
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const LAYERS = 3;
  /**
   * PERF FIX: Reduced beams per layer from 8 → 5.
   * 8×3 = 24 beams were being animated every frame. 5×3 = 15 beams
   * reduces GPU fill-rate pressure by ~37% — visually identical.
   */
  const BEAMS_PER_LAYER = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseRef.current;
    if (!canvas || !noiseCanvas) return;
    const ctx = canvas.getContext("2d");
    const nCtx = noiseCanvas.getContext("2d");
    if (!ctx || !nCtx) return;

    const resizeCanvas = () => {
      /**
       * PERF FIX: Cap devicePixelRatio at 2.
       * On high-DPI screens (DPR 3+, common on Android), the canvas
       * was drawing at 3× resolution — 9× the pixel count of a 1× screen.
       * Capping at 2 is visually indistinguishable and roughly halves
       * the canvas workload on those devices.
       */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      noiseCanvas.width = window.innerWidth * dpr;
      noiseCanvas.height = window.innerHeight * dpr;
      noiseCanvas.style.width = `${window.innerWidth}px`;
      noiseCanvas.style.height = `${window.innerHeight}px`;
      nCtx.setTransform(1, 0, 0, 1, 0, 0);
      nCtx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(window.innerWidth, window.innerHeight, layer));
        }
      }
    };

    resizeCanvas();

    // Generate static noise texture once (not every frame)
    const generateNoise = () => {
      const imageData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 15; // very subtle
      }
      nCtx.putImageData(imageData, 0, 0);
    };
    generateNoise();

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulseOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `rgba(108, 99, 255, 0)`);
      gradient.addColorStop(0.1, `rgba(108, 99, 255, ${pulseOpacity})`);
      gradient.addColorStop(0.9, `rgba(108, 99, 255, ${pulseOpacity * 0.6})`);
      gradient.addColorStop(1, `rgba(108, 99, 255, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    /**
     * PERF FIX: Throttle canvas to 30 fps instead of 60 fps.
     * The beam animation is slow and subtle — 30fps is imperceptible
     * from 60fps here, but halves the CPU/GPU time spent on canvas.
     */
    let lastTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const animate = (timestamp: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_INTERVAL) return; // skip frame
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Dark background
      ctx.fillStyle = "rgba(10, 10, 15, 1)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw noise overlay
      ctx.drawImage(noiseCanvas, 0, 0, window.innerWidth, window.innerHeight);

      // Draw and update beams
      beamsRef.current.forEach((beam) => {
        drawBeam(beam);
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
      });
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Noise overlay canvas */}
      <canvas
        ref={noiseRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-overlay"
      />

      {/* Purple radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(108,99,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div data-strix-hero-badge>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/10 text-[#a78bfa] text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff] animate-pulse" />
            AI-Powered Business Operating System
          </motion.div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          data-strix-hero-headline
        >
          {headline}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] via-[#a78bfa] to-[#6c63ff]">
            {highlight}
          </span>
        </h1>

        {/* Sub */}
        <p
          className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          data-strix-hero-sub
        >
          {subheadline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-strix-hero-ctas
        >
          <Link href={primaryCtaHref}>
            <Button
              size="lg"
              className="bg-[#6c63ff] hover:bg-[#5b52ee] text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#6c63ff]/30"
            >
              {primaryCtaLabel}
              <MoveRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href={secondaryCtaHref}>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold text-base backdrop-blur-sm transition-all duration-200"
            >
              <PhoneCall className="mr-2 w-4 h-4" />
              {secondaryCtaLabel}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
          data-strix-hero-stats
        >
          {[
            { value: "10x", label: "Faster Operations" },
            { value: "98%", label: "Uptime SLA" },
            { value: "500+", label: "Businesses Automated" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-white/40 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
};
