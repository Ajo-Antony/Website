"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

const FEATURES = [
  {
    id: "workflow",
    label: "Workflow Automation",
    icon: Workflow,
    image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200",
    description: "Topological graph execution engine that automates complex business processes end-to-end.",
  },
  {
    id: "multi-agent",
    label: "Multi-Agent AI",
    icon: Brain,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    description: "Six specialised AI agents with priority task queues handle your operations intelligently.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp CRM",
    icon: MessageSquareText,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200",
    description: "Session-aware messaging, lead pipelines and revenue forecasting — all in WhatsApp.",
  },
  {
    id: "analytics",
    label: "Real-time Analytics",
    icon: BarChart,
    image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200",
    description: "Revenue intelligence and conversion insights updated live as your business moves.",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: PlugIcon,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    description: "Connect your existing tools — CRMs, ERPs, calendars — with zero-code connectors.",
  },
  {
    id: "security",
    label: "Enterprise Security",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    description: "Bank-grade encryption and role-based access controls protect every data point.",
  },
  {
    id: "speed",
    label: "Lightning Fast",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    description: "Sub-second response times across all agents, even during high-volume campaigns.",
  },
  {
    id: "global",
    label: "Global Ready",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200",
    description: "Multi-language support and localisation built for Indian and global markets alike.",
  },
  {
    id: "team",
    label: "Team Collaboration",
    icon: Users,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
    description: "Shared inboxes, conversation routing and team performance dashboards in one place.",
  },
  {
    id: "mobile",
    label: "Mobile First",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200",
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
  }, [isPaused, nextStep]);

  const feature = FEATURES[currentIndex];

  const visibleItems = Array.from({ length: 5 }, (_, i) => {
    const idx = wrap(0, FEATURES.length, currentIndex - 2 + i);
    return { ...FEATURES[idx], relativeIndex: i - 2 };
  });

  return (
    <section
      id="why"
      className="relative w-full py-24 overflow-hidden bg-[#0a0a0f]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#6c63ff]/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/10 text-[#a78bfa] text-xs font-medium tracking-widest uppercase mb-6">
            Why StrixMind
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            data-strix-slide-up
          >
            Everything your business needs,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#a78bfa]">
              in one OS
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Ten powerful capabilities working together to automate, grow and protect your business.
          </p>
        </div>

        {/* Main carousel */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: scrolling list */}
          <div className="relative w-full lg:w-[340px] flex-shrink-0">
            <div
              className="relative overflow-hidden"
              style={{ height: ITEM_HEIGHT * 5 }}
            >
              {/* Fade masks */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

              {visibleItems.map((item, i) => {
                const isActive = item.relativeIndex === 0;
                const absIdx = wrap(
                  0,
                  FEATURES.length,
                  currentIndex - 2 + i
                );
                const Icon = item.icon;

                return (
                  <motion.div
                    key={`${item.id}-${step}`}
                    initial={{ y: ITEM_HEIGHT, opacity: 0 }}
                    animate={{
                      y: i * ITEM_HEIGHT,
                      opacity: isActive ? 1 : Math.abs(item.relativeIndex) === 1 ? 0.5 : 0.2,
                    }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute left-0 right-0"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <button
                      onClick={() => handleChipClick(absIdx)}
                      className={cn(
                        "w-full h-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 text-left",
                        isActive
                          ? "bg-[#6c63ff]/20 border border-[#6c63ff]/40"
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                          isActive ? "bg-[#6c63ff]/30" : "bg-white/5"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-[#a78bfa]" : "text-white/40"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm transition-colors",
                          isActive ? "text-white" : "text-white/40"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6c63ff]"
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === currentIndex
                      ? "w-5 h-1.5 bg-[#6c63ff]"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: feature card */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#111118]"
                style={{ minHeight: 380 }}
              >
                {/* Image — PERF FIX: use next/image with lazy loading */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                    loading="lazy"
                    unoptimized={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111118]/40 to-[#111118]" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-[#a78bfa]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.label}</h3>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed">{feature.description}</p>

                  {/* Auto-play progress bar */}
                  {!isPaused && (
                    <div className="mt-6 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        key={`bar-${step}`}
                        className="h-full bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Default export for page import compatibility
export default function FeatureCarouselSection() {
  return <FeatureCarousel />;
}
