import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types/content";

export const revalidate = 0;

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "coming-soon": "Coming soon",
};

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
          {projects.length === 0 ? (
            <p className="text-center text-ink-dim py-20">No projects published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <Link key={p.id} href={`/work/projects/${p.slug}`} className="group">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-accent to-accent-2 mb-4 overflow-hidden relative">
                    {p.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                        {p.title.charAt(0)}
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide bg-white/90 text-ink px-2.5 py-1 rounded-full">
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </div>
                  {p.category && <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">{p.category}</div>}
                  <h3 className="font-bold text-ink text-lg">{p.title}</h3>
                  {p.client && <p className="text-sm text-ink-soft mt-0.5">{p.client}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
