import type { Metadata } from "next";
import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/staticClient";
import type { GalleryImage } from "@/lib/types/content";
import GalleryClient from "@/components/pages/workPage/GalleryClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual snapshot of StrixMind's work — behind the scenes and finished projects.",
  alternates: { canonical: "https://strixmind.com/work/gallery" },
  openGraph: {
    title: "Gallery — StrixMind",
    description: "Snapshots from behind the scenes and finished work.",
    url: "https://strixmind.com/work/gallery",
    type: "website",
  },
};

export default async function WorkGalleryPage() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("gallery_images").select("*").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  const images = (data ?? []) as GalleryImage[];

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)] pb-24">
      {/* Editorial Header */}
      <section className="relative px-6 pt-36 pb-16 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-alt)] to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <Link 
            href="/work" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group mb-2"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> Back to Work
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text)]">
            Visual <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">Gallery</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Snapshots, interface mockups, behind-the-scenes system designs, and milestones from our builds.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <GalleryClient images={images} />
        </div>
      </section>
    </div>
  );
}
