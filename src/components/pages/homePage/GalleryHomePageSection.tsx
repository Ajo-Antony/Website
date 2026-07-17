"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { GalleryImage } from "@/lib/types/content";
import { Heart } from "lucide-react";
import Link from "next/link";

interface GalleryHomePageSectionProps {
  items: GalleryImage[];
}

export default function GalleryHomePageSection({ items }: GalleryHomePageSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id="featured-gallery" className="relative py-24 border-t border-[var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-alt)] to-transparent opacity-40 pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex text-[10px] font-mono tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
            Featured Gallery
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)]">
            Our Build <span className="italic font-normal text-accent font-serif">Highlights</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto text-sm sm:text-base font-light">
            Behind the scenes and finished products. Click to see details and interact in the gallery.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((img, index) => {
            const isTall = index % 3 === 1;
            const isWide = index % 5 === 0 && index !== 0;

            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] transition-all duration-300 hover:border-accent/30 hover:shadow-lg ${
                  isTall 
                    ? "aspect-[3/4]" 
                    : isWide
                      ? "sm:col-span-2 aspect-[16/9]"
                      : "aspect-square"
                }`}
              >
                <Link href="/work/gallery" className="block w-full h-full relative">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-6" />

                  {img.media_type === "video" ? (
                    <video
                      src={img.url}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <Image
                      src={img.url}
                      alt={img.alt ?? ""}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Icon details on hover */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1.5 text-white text-sm font-bold bg-black/40 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm">
                      <Heart size={16} className="fill-rose-500 text-rose-500" />
                      View Comments
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent pt-12 text-left">
                    <p className="text-white text-xs font-semibold truncate">
                      {img.caption || "StrixMind Build Snapshot"}
                    </p>
                    {img.media_type === "video" && (
                      <span className="inline-block mt-1 text-[8px] uppercase tracking-wider font-mono text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/20">
                        Video
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
