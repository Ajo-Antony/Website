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
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 flex flex-wrap items-end gap-4 mb-8"
      >
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Image or Video</label>
          <input
            type="file"
            name="file"
            accept="image/*,video/*"
            required
            className="block w-full text-sm text-[var(--text-muted)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-ink file:text-white file:text-sm file:font-medium file:cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Caption (optional)</label>
          <input
            type="text"
            name="caption"
            placeholder="e.g. Office launch day"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 bg-transparent text-ink"
          />
        </div>
        <div className="flex items-center gap-2 h-10 px-2 min-w-[180px]">
          <input
            type="checkbox"
            name="show_on_home"
            id="show_on_home_field"
            value="true"
            className="w-4 h-4 rounded border-[var(--border)] text-accent focus:ring-accent"
          />
          <label htmlFor="show_on_home_field" className="text-sm font-medium text-[var(--text)] cursor-pointer select-none">
            Show on Home Section
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-[0_8px_20px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </form>

      {error && (
        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No gallery items yet — upload your first one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-[var(--surface-alt)]">
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
                  
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {!img.published && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-900/80 text-white px-2 py-0.5 rounded-full w-max">
                        Hidden
                      </span>
                    )}
                    {img.show_on_home && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-indigo-900/95 text-white px-2 py-0.5 rounded-full w-max border border-indigo-500/20">
                        On Home
                      </span>
                    )}
                    {img.media_type === "video" && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-teal-950/90 text-teal-300 px-2 py-0.5 rounded-full w-max border border-teal-500/20">
                        Video
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 pb-1">
                  {img.caption && <p className="text-xs text-[var(--text-muted)] truncate mb-1">{img.caption}</p>}
                </div>
              </div>

              <div className="p-3 pt-1 space-y-2">
                <button
                  onClick={() => handleToggleHome(img.id, img.show_on_home)}
                  disabled={busyId === img.id}
                  className={`w-full text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors ${
                    img.show_on_home 
                      ? "bg-indigo-950/20 text-indigo-400 border-indigo-800/40 hover:bg-indigo-950/40" 
                      : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-alt)]"
                  }`}
                >
                  {img.show_on_home ? "Remove from Home" : "Allow on Home"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(img.id, img.published)}
                    disabled={busyId === img.id}
                    className="flex-1 text-xs font-medium px-2 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--surface-alt)] disabled:opacity-50"
                  >
                    {img.published ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.storage_path)}
                    disabled={busyId === img.id}
                    className="flex-1 text-xs font-medium px-2 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
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
