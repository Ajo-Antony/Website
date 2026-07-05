import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types/content";

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
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_images").select("*").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  const images = (data ?? []) as GalleryImage[];

  return (
    <>
      <section className="px-6 py-20 pt-32" style={{ background: "var(--hero-bg)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/work" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← Back to Work</Link>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 text-ink" style={{ letterSpacing: "-0.04em" }}>Gallery</h1>
          <p className="text-ink-soft mt-3">Snapshots from behind the scenes and finished work.</p>
        </div>
      </section>

      <section className="px-6 py-16 bg-[var(--surface)] border-t border-line">
        <div className="max-w-6xl mx-auto">
          {images.length === 0 ? (
            <p className="text-center text-ink-dim py-20">No images yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-2xl aspect-square">
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent text-white text-sm font-medium px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
