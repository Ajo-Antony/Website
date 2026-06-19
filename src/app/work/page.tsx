import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, BlogPost, GalleryImage } from "@/lib/types/content";
import { getContent } from "@/lib/actions/content";

export const revalidate = 0;

export default async function WorkHubPage() {
  const supabase = await createClient();
  const hub = await getContent("work.hub") as any;

  const [{ data: projects }, { data: posts }, { data: images }] = await Promise.all([
    supabase.from("projects").select("*").eq("published", true).eq("featured", true).order("sort_order").limit(3),
    supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("gallery_images").select("*").eq("published", true).order("created_at", { ascending: false }).limit(6),
  ]);

  const featuredProjects = (projects ?? []) as Project[];
  const latestPosts = (posts ?? []) as BlogPost[];
  const galleryPreview = (images ?? []) as GalleryImage[];

  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 sm:pt-40 sm:pb-28" style={{ background: "linear-gradient(160deg,#f7f6fd,#eef0fb)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-accent text-white text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
            {hub.badge}
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6 text-work-dark">
            {hub.heading}<br />
            <span className="bg-gradient-to-r from-accent to-teal bg-clip-text text-transparent">{hub.headingAccent}</span>
          </h1>
          <p className="text-ink-soft text-lg max-w-xl mx-auto mb-10">
            {hub.paragraph}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/work/projects" className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(108,99,255,0.32)] hover:opacity-90 transition-opacity">
              {hub.primaryCtaLabel}
            </Link>
            <Link href="/work/blog" className="border border-line text-work-dark font-bold px-7 py-3.5 rounded-full hover:bg-surface-alt transition-colors">
              {hub.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Three hubs */}
      <section className="px-6 py-20 bg-work-gray">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { href: "/work/projects", icon: "💼", title: "Projects", desc: "Client case studies — the problem, the build, the outcome." },
            { href: "/work/blog", icon: "📝", title: "Blog", desc: "Notes on building, shipping, and growing StrixMind." },
            { href: "/work/gallery", icon: "🖼️", title: "Gallery", desc: "Snapshots from behind the scenes and finished work." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-3xl p-8 border border-work-line hover:border-accent/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-work-dark mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              <div className="mt-5 text-sm font-bold text-accent flex items-center gap-1.5">
                Explore <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold text-work-dark">Featured projects</h2>
              <Link href="/work/projects" className="text-sm font-bold text-accent hover:text-accent-deep underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featuredProjects.map((p) => (
                <Link key={p.id} href={`/work/projects/${p.slug}`} className="group">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-accent to-accent-2 mb-4 overflow-hidden relative">
                    {p.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {p.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">{p.category}</div>
                  <h3 className="font-bold text-work-dark">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest blog */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-20 bg-work-gray">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold text-work-dark">From the blog</h2>
              <Link href="/work/blog" className="text-sm font-bold text-work-dark hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/work/blog/${post.slug}`} className="bg-white rounded-2xl p-6 border border-work-line hover:border-accent/40 transition-colors">
                  <h3 className="font-bold text-work-dark mb-2 leading-snug">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold text-work-dark">Gallery</h2>
              <Link href="/work/gallery" className="text-sm font-bold text-work-dark hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {galleryPreview.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.id} src={img.url} alt={img.alt ?? ""} className="aspect-square w-full object-cover rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#6c63ff,#a78bfa)" }}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-white">{hub.ctaHeading}</h2>
        <p className="text-white/80 mb-8">{hub.ctaParagraph}</p>
        <Link href="/#contact" className="inline-block bg-white text-accent font-bold px-8 py-3.5 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
          {hub.ctaButtonLabel}
        </Link>
      </section>
    </>
  );
}
