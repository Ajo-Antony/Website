import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown } from "@/lib/markdown";
import type { Project } from "@/lib/types/content";

export const revalidate = 60;

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "coming-soon": "Coming soon",
};

async function getProject(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).eq("published", true).single();
  return data as Project | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `https://strixmind.in/work/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary ?? undefined,
      url: `https://strixmind.in/work/projects/${slug}`,
      type: "website",
      images: project.cover_image ? [{ url: project.cover_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary ?? undefined,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  };
}

export default async function WorkProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const html = project.description ? renderMarkdown(project.description) : "";

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary ?? undefined,
    url: `https://strixmind.in/work/projects/${slug}`,
    image: project.cover_image ?? undefined,
    creator: { "@type": "Organization", name: "StrixMind" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />

      <section className="px-6 py-20 pt-32" style={{ background: "linear-gradient(160deg,#f7f6fd,#eef0fb)" }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/work/projects" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← All projects</Link>
          <div className="flex flex-wrap items-center gap-3 mt-6 mb-3">
            <span className="bg-accent text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
              {STATUS_LABEL[project.status] ?? project.status}
            </span>
            {project.category && <span className="text-ink-soft text-sm">{project.category}</span>}
            {project.year && <span className="text-ink-soft text-sm">· {project.year}</span>}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-ink" style={{ letterSpacing: "-0.04em" }}>{project.title}</h1>
          {project.client && <p className="text-ink-soft mt-3">{project.client}</p>}
        </div>
      </section>

      {project.cover_image && (
        <div className="max-w-5xl mx-auto px-6 -mt-8">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <section className="px-6 py-16 bg-white border-t border-line">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-12">
          <article
            className="prose prose-lg prose-headings:font-bold prose-headings:text-ink prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <aside className="space-y-6">
            {project.tags.length > 0 && (
              <div>
                <div className="text-xs font-bold text-ink-dim uppercase tracking-wide mb-2">Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-surface-alt text-ink text-xs font-semibold px-3 py-1.5 rounded-full border border-line">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.results.length > 0 && (
              <div>
                <div className="text-xs font-bold text-ink-dim uppercase tracking-wide mb-2">At a glance</div>
                <div className="flex flex-col gap-3">
                  {project.results.map((r, i) => (
                    <div key={i} className="bg-surface-alt rounded-xl p-3.5 border border-line">
                      <div className="text-xs text-ink-soft">{r.label}</div>
                      <div className="font-bold text-ink text-sm mt-0.5">{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gradient-to-br from-accent to-accent-2 text-white font-bold px-5 py-3 rounded-full shadow-[0_8px_24px_rgba(108,99,255,0.32)] hover:opacity-90 transition-opacity"
              >
                Visit live site ↗
              </a>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
