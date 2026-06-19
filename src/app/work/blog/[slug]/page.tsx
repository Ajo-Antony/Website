import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown } from "@/lib/markdown";
import type { BlogPost } from "@/lib/types/content";

export const revalidate = 0;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
  return data as BlogPost | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — StrixMind`, description: post.excerpt ?? undefined };
}

export default async function WorkBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <>
      <section className="px-6 py-20 pt-32" style={{ background: "linear-gradient(160deg,#f7f6fd,#eef0fb)" }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/work/blog" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← All posts</Link>
          <div className="text-xs font-semibold text-accent mt-6">{formatDate(post.published_at)}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight text-ink" style={{ letterSpacing: "-0.03em" }}>{post.title}</h1>
        </div>
      </section>

      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-6 -mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-3xl shadow-xl" />
        </div>
      )}

      <article className="px-6 py-16 bg-white border-t border-line">
        <div
          className="max-w-3xl mx-auto prose prose-lg prose-headings:font-bold prose-headings:text-ink prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
