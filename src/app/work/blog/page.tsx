import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/content";
import { Clock, ArrowRight } from "lucide-react";
import { blurDataURL } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building, shipping, and growing StrixMind — AI automation, product decisions, and lessons from the field.",
  alternates: { canonical: "https://strixmind.com/work/blog" },
  openGraph: {
    title: "Blog — StrixMind",
    description: "Notes on building, shipping, and growing StrixMind.",
    url: "https://strixmind.com/work/blog",
    type: "website",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Calculate an approximate reading time based on content length
function getReadingTime(content: string | null): string {
  if (!content) return "2 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 225); // average speed
  return `${Math.max(2, minutes)} min read`;
}

export default async function WorkBlogListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  const posts = (data ?? []) as BlogPost[];

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

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
            The StrixMind <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">Journal</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Systems engineering notes, deep workflow audits, and building the future of automated enterprise growth.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24 bg-[var(--surface-alt)] rounded-3xl border border-[var(--border)] border-dashed">
              <p className="text-[var(--text-muted)] text-base font-light">No journal entries published yet — check back soon.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {/* Featured Post (Highlighted Widescreen Layout) */}
              {featuredPost && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Entry</span>
                  </div>
                  
                  <Link 
                    href={`/work/blog/${featuredPost.slug}`}
                    className="group block bg-[var(--surface-alt)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-[var(--accent)]/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.04)] transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {featuredPost.cover_image && (
                        <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:h-[420px] relative overflow-hidden bg-slate-900 border-r lg:border-r border-[var(--border)]">
                          <Image
                            src={featuredPost.cover_image}
                            alt={featuredPost.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-103"
                            priority
                            placeholder="blur"
                            blurDataURL={blurDataURL}
                          />
                        </div>
                      )}
                      <div className={`p-8 sm:p-12 lg:col-span-5 flex flex-col justify-center ${!featuredPost.cover_image ? 'lg:col-span-12' : ''}`}>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                          <span>{formatDate(featuredPost.published_at)}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                          <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {getReadingTime(featuredPost.content)}</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight group-hover:text-[var(--accent)] transition-colors leading-snug">
                          {featuredPost.title}
                        </h2>
                        
                        {featuredPost.excerpt && (
                          <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-light">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                          <span>Read full entry</span>
                          <div className="w-8 h-8 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)]/30 bg-transparent group-hover:bg-[var(--accent)]/5 flex items-center justify-center transition-all">
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid of remaining posts */}
              {remainingPosts.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-3">
                    Recent Updates
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {remainingPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/work/blog/${post.slug}`}
                        className="group flex flex-col h-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-3xl p-4 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
                      >
                        {post.cover_image && (
                          <div className="aspect-[16/10] rounded-2xl overflow-hidden relative mb-5 border border-[var(--border)]">
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={blurDataURL}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 flex flex-col px-2">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                            <span>{formatDate(post.published_at)}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                            <span className="flex items-center gap-1 font-semibold"><Clock size={10} /> {getReadingTime(post.content)}</span>
                          </div>
                          
                          <h4 className="font-extrabold text-[var(--text)] text-lg leading-snug group-hover:text-[var(--accent)] transition-colors mb-3">
                            {post.title}
                          </h4>
                          
                          {post.excerpt && (
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-light line-clamp-3 mb-6">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <div className="mt-auto pt-4 flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                            <span>Read article</span>
                            <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/5 transition-all">
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
