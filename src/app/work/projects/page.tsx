import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types/content";
import ProjectsCategoryFilter from "@/components/pages/workPage/ProjectsCategoryFilter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description: "StrixMind client case studies — the problem, the build, and the outcome for every project we've delivered.",
  alternates: { canonical: "https://strixmind.com/work/projects" },
  openGraph: {
    title: "Projects — StrixMind",
    description: "Client case studies — the problem, the build, and the outcome.",
    url: "https://strixmind.com/work/projects",
    type: "website",
  },
};

export default async function WorkProjectsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      {/* Editorial Header */}
      <section className="relative px-6 pt-36 pb-20 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-alt)] to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <Link 
            href="/work" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group mb-2"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> Back to Work
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text)]">
            Case <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">Studies</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Real problems. Technical builds. High-impact business outcomes for forward-thinking brands.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <ProjectsCategoryFilter projects={projects} />
        </div>
      </section>
    </div>
  );
}
