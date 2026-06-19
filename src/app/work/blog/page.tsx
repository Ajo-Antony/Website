import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/content";

export const revalidate = 0;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function WorkBlogListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  const posts = (data ?? []) as BlogPost[];

  return (
    <>
      <section className="px-6 py-20 pt-32" style={{ background: "linear-gradient(160deg,#f7f6fd,#eef0fb)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/work" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← Back to Work</Link>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 text-ink" style={{ letterSpacing: "-0.04em" }}>Blog</h1>
          <p className="text-ink-soft mt-3">Notes on building, shipping, and growing StrixMind.</p>
        </div>
      </section>

      <section className="px-6 py-16 bg-white border-t border-line">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-ink-dim py-20">No posts yet — check back soon.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/work/blog/${post.slug}`}
                  className="flex flex-col sm:flex-row gap-6 bg-surface-alt rounded-3xl p-6 border border-line hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(108,99,255,0.08)] transition-all"
                >
                  {post.cover_image && (
                    <div className="sm:w-56 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-ink-dim mb-2">{formatDate(post.published_at)}</div>
                    <h2 className="text-xl font-bold text-ink mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-ink-soft leading-relaxed">{post.excerpt}</p>}
                    <div className="mt-4 text-sm font-bold text-accent">Read more →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
