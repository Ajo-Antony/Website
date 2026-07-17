"use client";

import { useRef, useState } from "react";
import { uploadGalleryImage, deleteGalleryImage, toggleGalleryPublished, toggleGalleryShowOnHome } from "@/lib/actions/gallery";
import type { GalleryImage } from "@/lib/types/content";

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await uploadGalleryImage(formData);
    setPending(false);
    if (res?.error) setError(res.error);
    else formRef.current?.reset();
  }

  async function handleDelete(id: string, path: string) {
    if (!confirm("Delete this item?")) return;
    setBusyId(id);
    await deleteGalleryImage(id, path);
    setBusyId(null);
  }

  async function handleToggle(id: string, published: boolean) {
    setBusyId(id);
    await toggleGalleryPublished(id, !published);
    setBusyId(null);
  }

  async function handleToggleHome(id: string, showOnHome: boolean) {
    setBusyId(id);
    await toggleGalleryShowOnHome(id, !showOnHome);
    setBusyId(null);
  }

  return (
    <div>
      <form
        ref={formRef}
        action={handleSubmit}
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 space-y-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-1.5">Image or Video</label>
            <input
              type="file"
              name="file"
              accept="image/*,video/*"
              required
              className="block w-full text-xs text-[var(--text-muted)] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border file:border-[var(--border)] file:bg-[var(--surface-alt)] file:text-ink file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-[var(--border)] file:transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Dark Minimalist Dashboard"
              className="w-full px-4 py-2 bg-transparent border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-1.5">Caption (optional)</label>
            <input
              type="text"
              name="caption"
              placeholder="e.g. Office launch day"
              className="w-full px-4 py-2 bg-transparent border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-1.5">Tags (comma-separated, optional)</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. web, ui, nextjs, dashboard"
              className="w-full px-4 py-2 bg-transparent border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 text-ink"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="show_on_home"
              id="show_on_home_field"
              value="true"
              className="w-4 h-4 rounded border-[var(--border)] text-accent focus:ring-accent/40 cursor-pointer"
            />
            <label htmlFor="show_on_home_field" className="text-xs font-semibold text-[var(--text)] cursor-pointer select-none">
              Show on Home Section
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="bg-ink hover:opacity-90 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {pending ? "Uploading snapshot..." : "Upload Snapshot"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No gallery items yet — upload your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative aspect-square bg-[var(--surface-alt)]">
                  {img.media_type === "video" ? (
                    <video 
                      src={img.url} 
                      muted 
                      loop 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
                  )}
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {!img.published && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-950/85 text-white px-2 py-0.5 rounded-md w-max">
                        Hidden
                      </span>
                    )}
                    {img.show_on_home && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-950/95 text-white px-2 py-0.5 rounded-md w-max border border-indigo-500/20">
                        On Home
                      </span>
                    )}
                    {img.media_type === "video" && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-950/95 text-teal-300 px-2 py-0.5 rounded-md w-max border border-teal-500/20">
                        Video
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  {img.title && (
                    <h3 className="text-xs font-bold text-ink truncate" title={img.title}>
                      {img.title}
                    </h3>
                  )}
                  {img.caption && (
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  )}
                  {img.tags && img.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {img.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-alt)] text-[var(--text-muted)] border border-[var(--border)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-1 space-y-2">
                <button
                  onClick={() => handleToggleHome(img.id, img.show_on_home)}
                  disabled={busyId === img.id}
                  className={`w-full text-xs font-semibold px-2.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                    img.show_on_home 
                      ? "bg-indigo-950/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-950/20" 
                      : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-alt)]"
                  }`}
                >
                  {img.show_on_home ? "Remove from Home" : "Allow on Home"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(img.id, img.published)}
                    disabled={busyId === img.id}
                    className="flex-1 text-xs font-medium px-2 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-alt)] disabled:opacity-50 cursor-pointer"
                  >
                    {img.published ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.storage_path)}
                    disabled={busyId === img.id}
                    className="flex-1 text-xs font-medium px-2 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
