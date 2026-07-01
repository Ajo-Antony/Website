"use client";

import { useState } from "react";
import type { Project } from "@/lib/types/content";
import { formatResultLines } from "@/lib/slugify";

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await action(formData);
    if (res?.error) {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 max-w-2xl">
      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
      )}

      <label className="block text-sm font-medium text-[var(--text)] mb-1">Project title</label>
      <input
        name="title"
        defaultValue={project?.title}
        required
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Slug <span className="text-[var(--text-dim)]">(leave blank to auto-generate)</span>
      </label>
      <input
        name="slug"
        defaultValue={project?.slug}
        placeholder="thoppil-jewellery"
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Client</label>
          <input
            name="client"
            defaultValue={project?.client ?? ""}
            placeholder="Thoppil Jewellery, Kottayam"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Category</label>
          <input
            name="category"
            defaultValue={project?.category ?? ""}
            placeholder="E-Commerce & Branding"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Year</label>
          <input
            name="year"
            defaultValue={project?.year ?? ""}
            placeholder="2025"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "completed"}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
            <option value="coming-soon">Coming soon</option>
          </select>
        </div>
      </div>

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Summary <span className="text-[var(--text-dim)]">(shown on the project card)</span>
      </label>
      <textarea
        name="summary"
        defaultValue={project?.summary ?? ""}
        rows={2}
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Cover image {project?.cover_image && <span className="text-[var(--text-dim)]">(leave blank to keep current)</span>}
      </label>
      {project?.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.cover_image} alt="" className="w-32 h-20 object-cover rounded-lg mb-2 border border-[var(--border)]" />
      )}
      <input
        type="file"
        name="cover_image"
        accept="image/*"
        className="block w-full mb-4 text-sm text-[var(--text-muted)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-ink file:text-white file:text-sm file:font-medium file:cursor-pointer"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Full description <span className="text-[var(--text-dim)]">(Markdown supported)</span>
      </label>
      <textarea
        name="description"
        defaultValue={project?.description ?? ""}
        rows={8}
        placeholder={"What problem did the client have? What did you build? What was the outcome?"}
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Tags <span className="text-[var(--text-dim)]">(comma separated)</span>
      </label>
      <input
        name="tags"
        defaultValue={project?.tags?.join(", ") ?? ""}
        placeholder="Next.js, Supabase, E-Commerce"
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Results / metrics <span className="text-[var(--text-dim)]">(one "Label: Value" per line, optional)</span>
      </label>
      <textarea
        name="results"
        defaultValue={project?.results ? formatResultLines(project.results) : ""}
        rows={3}
        placeholder={"Pages shipped: Collections, Products, Admin\nBackend: Supabase + Node.js"}
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Live link <span className="text-[var(--text-dim)]">(optional)</span>
      </label>
      <input
        name="link"
        defaultValue={project?.link ?? ""}
        placeholder="https://example.com"
        className="w-full mb-5 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <div className="flex flex-col gap-2 mb-6">
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="w-4 h-4" />
          Featured (shown in the homepage teaser)
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="w-4 h-4" />
          Published (visible on the live site)
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {pending ? "Saving…" : project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
