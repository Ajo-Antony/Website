import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types/content";
import ProjectsCategoryFilter from "@/components/pages/workPage/ProjectsCategoryFilter";

export const revalidate = 0;

export default async function WorkProjectsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <>
      <section className="px-6 py-20 pt-32" style={{ background: "linear-gradient(160deg,#f7f6fd,#eef0fb)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/work" className="text-ink-dim text-sm font-medium hover:text-accent transition-colors">← Back to Work</Link>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 text-ink" style={{ letterSpacing: "-0.04em" }}>Projects</h1>
          <p className="text-ink-soft mt-3">The problem, the build, and the outcome — for every client we&apos;ve worked with.</p>
        </div>
      </section>

      <section className="px-6 py-16 bg-white border-t border-line">
        <div className="max-w-6xl mx-auto">
          <ProjectsCategoryFilter projects={projects} />
        </div>
      </section>
    </>
  );
}
