"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/types/content";

export default function BlogPostForm({
  post,
  action,
}: {
  post?: BlogPost;
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
    // On success the action redirects, so no need to reset pending.
  }

  return (
    <form action={handleSubmit} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 max-w-2xl">
      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
      )}

      <label className="block text-sm font-medium text-[var(--text)] mb-1">Title</label>
      <input
        name="title"
        defaultValue={post?.title}
        required
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Slug <span className="text-[var(--text-dim)]">(leave blank to auto-generate from title)</span>
      </label>
      <input
        name="slug"
        defaultValue={post?.slug}
        placeholder="how-we-built-our-ai-platform"
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">Excerpt</label>
      <textarea
        name="excerpt"
        defaultValue={post?.excerpt ?? ""}
        rows={2}
        placeholder="One or two sentences shown on the blog list page."
        className="w-full mb-4 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Cover image {post?.cover_image && <span className="text-[var(--text-dim)]">(leave blank to keep current)</span>}
      </label>
      {post?.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image} alt="" className="w-32 h-20 object-cover rounded-lg mb-2 border border-[var(--border)]" />
      )}
      <input
        type="file"
        name="cover_image"
        accept="image/*"
        className="block w-full mb-4 text-sm text-[var(--text-muted)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-ink file:text-white file:text-sm file:font-medium file:cursor-pointer"
      />

      <label className="block text-sm font-medium text-[var(--text)] mb-1">
        Content <span className="text-[var(--text-dim)]">(Markdown supported)</span>
      </label>
      <textarea
        name="content"
        defaultValue={post?.content ?? ""}
        rows={14}
        required
        placeholder={"## A subheading\n\nWrite your post here. **Bold**, *italics*, and [links](https://...) all work."}
        className="w-full mb-5 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />

      <label className="flex items-center gap-2 mb-6 text-sm text-[var(--text)]">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="w-4 h-4" />
        Published (visible on the live site)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {pending ? "Saving…" : post ? "Save changes" : "Create post"}
      </button>
    </form>
  );
}
