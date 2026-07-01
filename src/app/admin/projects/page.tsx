import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import DeleteButton from "@/components/pages/adminPage/DeleteButton";
import { deleteProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types/content";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "coming-soon": "Coming soon",
};

export default async function AdminProjectsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <AdminShell active="/admin/projects">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink mb-1">Projects</h1>
          <p className="text-sm text-[var(--text-muted)]">Case studies shown on strixmind.ai/work/projects.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-[0_8px_20px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity"
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No projects yet — add your first one.</p>
      ) : (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink truncate">{p.title}</span>
                  {p.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-accent text-white px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  {!p.published && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-[var(--surface-alt)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-dim)] mt-0.5">
                  {p.client ?? "No client"} · {STATUS_LABEL[p.status] ?? p.status} · /work/projects/{p.slug}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--surface-alt)]"
                >
                  Edit
                </Link>
                <DeleteButton id={p.id} action={deleteProject} confirmText="Delete this project? This can't be undone." />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
