"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from "@/lib/types/content";
import { Heart, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

interface GalleryHomePageSectionProps {
  items: GalleryImage[];
}

export default function GalleryHomePageSection({ items }: GalleryHomePageSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragTriggered, setIsDragTriggered] = useState(false);

  const totalItems = items.length;

  const nextSlide = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Auto-rotation every 6 seconds, paused on hover/focus
  useEffect(() => {
    if (totalItems === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [totalItems, nextSlide]);

  if (totalItems === 0) return null;

  return (
    <section id="featured-gallery" className="relative py-24 border-t border-[var(--border)] overflow-hidden bg-gradient-to-b from-[var(--surface-alt)]/30 to-transparent">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-alt)] to-transparent opacity-40 pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Header with Nav Controls inline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 text-left">
            <div className="inline-flex text-[10px] font-mono tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
              Interactive Snapshots
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)]">
              Our Build <span className="italic font-normal text-accent font-serif">Highlights</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg text-sm sm:text-base font-light">
              Behind the scenes and finished products. Click to view full highlights, join the discussion, and leave reviews.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-ink hover:border-accent hover:bg-[var(--surface-alt)] flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-ink hover:border-accent hover:bg-[var(--surface-alt)] flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
            >
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative select-none" ref={containerRef}>
          <div className="overflow-hidden rounded-3xl -mx-4 px-4 py-2">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / totalItems)}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="flex gap-6"
              style={{
                width: `${totalItems * 100}%`,
              }}
            >
              {items.map((img, index) => {
                const isActive = index === currentIndex;
                
                return (
                  <div
                    key={img.id}
                    className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0"
                    style={{
                      // Each slide width calculation based on the dynamic total percentage
                      width: `calc(${100 / totalItems}% - ${((totalItems - 1) * 24) / totalItems}px)`
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                      className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl aspect-square"
                    >
                      <Link href="/work/gallery" className="block w-full h-full relative">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-5" />

                        {img.media_type === "video" ? (
                          <div className="relative w-full h-full">
                            <video
                              src={img.url}
                              muted
                              loop
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-10">
                              <Play size={10} className="fill-white text-white" />
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={img.url}
                            alt={img.alt ?? ""}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        )}

                        {/* Icon details on hover */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                          <span className="flex items-center gap-1.5 text-white text-[11px] font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm shadow-sm transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                            <Heart size={13} className="fill-rose-500 text-rose-500" />
                            Interact & Comments
                          </span>
                        </div>

                        {/* Caption & Title */}
                        <div className="absolute inset-x-0 bottom-0 p-5 z-20 bg-gradient-to-t from-black/95 to-transparent pt-12 text-left space-y-1">
                          <h3 className="text-white text-xs font-bold truncate leading-tight">
                            {img.title || "StrixMind Build Snapshot"}
                          </h3>
                          {img.caption && (
                            <p className="text-white/70 text-[10px] truncate leading-normal">
                              {img.caption}
                            </p>
                          )}
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            {img.tags && img.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {img.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-[8px] font-mono text-white/50 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div />
                            )}
                            {img.media_type === "video" && (
                              <span className="text-[8px] uppercase tracking-wider font-mono text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/20">
                                Video
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? "w-8 bg-accent" 
                  : "w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

