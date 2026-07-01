import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown } from "@/lib/markdown";
import type { BlogPost } from "@/lib/types/content";

export const revalidate = 60;

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
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `https://strixmind.in/work/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `https://strixmind.in/work/blog/${slug}`,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function WorkBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: `https://strixmind.in/work/blog/${slug}`,
    datePublished: post.published_at ?? undefined,
    image: post.cover_image ?? undefined,
    author: { "@type": "Organization", name: "StrixMind" },
    publisher: {
      "@type": "Organization",
      name: "StrixMind",
      logo: { "@type": "ImageObject", url: "https://strixmind.in/brand/strixmind-wordmark.svg" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <section className="px-6 py-20 pt-32" style={{ background: "var(--hero-bg)" }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/work/blog" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← All posts</Link>
          <div className="text-xs font-semibold text-accent mt-6">{formatDate(post.published_at)}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight text-ink" style={{ letterSpacing: "-0.03em" }}>{post.title}</h1>
        </div>
      </section>

      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-6 -mt-8">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <article className="px-6 py-16 bg-[var(--surface)] border-t border-line">
        <div
          className="max-w-3xl mx-auto prose prose-lg prose-headings:font-bold prose-headings:text-ink prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
