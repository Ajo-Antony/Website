"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  Brain,
  MessageSquareText,
  BarChart,
  PlugIcon,
  Shield,
  Zap,
  Globe,
  Users,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureIllustration } from "./FeatureIllustration";

// StrixMind product features — each paired with a custom vector scene
// (see FeatureIllustration.tsx) instead of stock photography.
const FEATURES = [
  {
    id: "workflow",
    label: "Workflow Automation",
    icon: Workflow,
    description: "Topological graph execution engine that automates complex business processes end-to-end.",
  },
  {
    id: "multi-agent",
    label: "Multi-Agent AI",
    icon: Brain,
    description: "Six specialised AI agents with priority task queues handle your operations intelligently.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp CRM",
    icon: MessageSquareText,
    description: "Session-aware messaging, lead pipelines and revenue forecasting — all in WhatsApp.",
  },
  {
    id: "analytics",
    label: "Real-time Analytics",
    icon: BarChart,
    description: "Revenue intelligence and conversion insights updated live as your business moves.",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: PlugIcon,
    description: "Connect your existing tools — CRMs, ERPs, calendars — with zero-code connectors.",
  },
  {
    id: "security",
    label: "Enterprise Security",
    icon: Shield,
    description: "Bank-grade encryption and role-based access controls protect every data point.",
  },
  {
    id: "speed",
    label: "Lightning Fast",
    icon: Zap,
    description: "Sub-second response times across all agents, even during high-volume campaigns.",
  },
  {
    id: "global",
    label: "Global Ready",
    icon: Globe,
    description: "Multi-language support and localisation built for Indian and global markets alike.",
  },
  {
    id: "team",
    label: "Team Collaboration",
    icon: Users,
    description: "Shared inboxes, conversation routing and team performance dashboards in one place.",
  },
  {
    id: "mobile",
    label: "Mobile First",
    icon: Smartphone,
    description: "Full-featured mobile experience — manage leads, reply to chats, view analytics on the go.",
  },
];

const AUTO_PLAY_INTERVAL = 3200;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <section id="why" style={{ padding: "8rem 0", borderTop: "1px solid var(--glass-bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "var(--accent)", background: "rgba(108,99,255,0.07)", border: "1px solid var(--glass-bg)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
            Why StrixMind
          </div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text)", maxWidth: 600, margin: "0 auto 1rem" }}>
            Everything your business needs, in one intelligent platform
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            From lead capture to deal closure, StrixMind automates every step so your team can focus on what matters most.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-[rgba(108,99,255,0.15)] shadow-[0_20px_64px_var(--border)]">

            {/* Left panel — feature list */}
            <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-deep)]">
              <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/80 to-transparent z-40" />
              <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-[var(--accent-deep)] via-[var(--accent-deep)]/80 to-transparent z-40" />

              <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
                {FEATURES.map((feature, index) => {
                  const isActive = index === currentIndex;
                  const distance = index - currentIndex;
                  const wrappedDistance = wrap(
                    -(FEATURES.length / 2),
                    FEATURES.length / 2,
                    distance
                  );
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.id}
                      style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                      animate={{
                        y: wrappedDistance * ITEM_HEIGHT,
                        // Softened from *0.25 — the old falloff combined with
                        // text-white/60 pushed off-center chips below WCAG
                        // contrast thresholds. This keeps the fade effect
                        // but keeps every position legible.
                        opacity: 1 - Math.abs(wrappedDistance) * 0.15,
                      }}
                      transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                      className="absolute flex items-center justify-start"
                    >
                      <button
                        onClick={() => handleChipClick(index)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className={cn(
                          "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                          isActive
                            ? "bg-[var(--surface)] text-[var(--accent)] border-[var(--border)] z-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                            : "bg-transparent text-white/70 border-white/20 hover:border-white/40 hover:text-white"
                        )}
                      >
                        <div className={cn("flex items-center justify-center transition-colors duration-500", isActive ? "text-[var(--accent)]" : "text-white/55")}>
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <span className="font-semibold text-sm md:text-[15px] tracking-tight whitespace-nowrap">
                          {feature.label}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right panel — image cards */}
            <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-[var(--hero-panel)] flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border)]">
              <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
                {FEATURES.map((feature, index) => {
                  const status = getCardStatus(index);
                  const isActive = status === "active";
                  const isPrev = status === "prev";
                  const isNext = status === "next";

                  return (
                    <motion.div
                      key={feature.id}
                      initial={false}
                      animate={{
                        x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                        scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                        opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                        rotate: isPrev ? -3 : isNext ? 3 : 0,
                        zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                      className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-[var(--border)] bg-[var(--surface)] origin-center shadow-[0_20px_60px_rgba(108,99,255,0.15)]"
                    >
                      <div
                        className={cn(
                          "w-full h-full transition-all duration-700",
                          isActive ? "opacity-100 blur-0" : "opacity-70 blur-[2px] brightness-75"
                        )}
                        aria-hidden="true"
                      >
                        <FeatureIllustration id={feature.id} />
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                          >
                            <div className="bg-[var(--surface)] text-[var(--accent)] px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-[rgba(108,99,255,0.2)]">
                              {index + 1} • {feature.label}
                            </div>
                            <p className="text-white font-semibold text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                              {feature.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={cn("absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}>
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
                        <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.3em] font-mono bg-black/30 px-2 py-0.5 rounded-full">
                          StrixMind
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCarousel;