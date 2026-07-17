"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Tag, ArrowRight } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import type { Project } from "@/lib/types/content";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "coming-soon": "Coming soon",
};

export default function ProjectsCategoryFilter({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [projects]);

  const tabs = useMemo(
    () => [
      { title: "All", icon: LayoutGrid },
      ...categories.map((c) => ({ title: c, icon: Tag })),
    ],
    [categories]
  );

  const [active, setActive] = useState<number | null>(0);

  const filtered =
    active === null || active === 0
      ? projects
      : projects.filter((p) => p.category === categories[active - 1]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-24 bg-[var(--surface-alt)] rounded-3xl border border-[var(--border)] border-dashed">
        <p className="text-[var(--text-muted)] text-base font-light">No projects published yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.length > 1 && (
        <div className="flex justify-center">
          <ExpandableTabs
            tabs={tabs}
            activeColor="text-[var(--accent)]"
            onChange={(i) => setActive(i ?? 0)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p) => {
          const isCompleted = p.status === "completed";
          const isInProgress = p.status === "in-progress";

          return (
            <Link 
              key={p.id} 
              href={`/work/projects/${p.slug}`} 
              className="group flex flex-col h-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-3xl p-4 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] mb-5 overflow-hidden relative border border-[var(--border)]">
                {p.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={p.cover_image} 
                    alt={p.title} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl font-extrabold opacity-80 font-sans tracking-tight">
                    {p.title.charAt(0)}
                  </div>
                )}
                
                {/* Modern Status Badge */}
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border ${
                  isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : isInProgress
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-slate-500/10 border-slate-500/20 text-slate-500"
                }`}>
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
              </div>

              {/* Text & Content Block */}
              <div className="flex-1 flex flex-col px-2">
                {p.category && (
                  <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-1.5 inline-block">
                    {p.category}
                  </span>
                )}
                
                <h3 className="font-extrabold text-[var(--text)] text-lg sm:text-xl leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {p.title}
                </h3>
                
                {p.client && (
                  <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                    Client: <span className="text-[var(--text)]">{p.client}</span>
                  </p>
                )}

                {/* Arrow indicator at bottom of card */}
                <div className="mt-auto pt-6 flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                  <span>View Case Study</span>
                  <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/5 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
