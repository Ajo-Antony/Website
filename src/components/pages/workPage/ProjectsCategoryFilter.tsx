"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Tag } from "lucide-react";
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
    return <p className="text-center text-ink-dim py-20">No projects published yet — check back soon.</p>;
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="flex justify-center mb-10">
          <ExpandableTabs
            tabs={tabs}
            activeColor="text-accent"
            onChange={(i) => setActive(i ?? 0)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
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
    </>
  );
}
