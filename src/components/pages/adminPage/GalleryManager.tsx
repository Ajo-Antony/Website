"use client";

import { useRef, useState } from "react";
import { uploadGalleryImage, deleteGalleryImage, toggleGalleryPublished } from "@/lib/actions/gallery";
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
    if (!confirm("Delete this image?")) return;
    setBusyId(id);
    await deleteGalleryImage(id, path);
    setBusyId(null);
  }

  async function handleToggle(id: string, published: boolean) {
    setBusyId(id);
    await toggleGalleryPublished(id, !published);
    setBusyId(null);
  }

  return (
    <div>
      <form
        ref={formRef}
        action={handleSubmit}
        className="bg-[var(--surface)] rounded-2xl border border-gray-200 p-6 flex flex-wrap items-end gap-4 mb-8"
      >
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-ink file:text-white file:text-sm file:font-medium file:cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
          <input
            type="text"
            name="caption"
            placeholder="e.g. Office launch day"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
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
        <p className="text-sm text-gray-500">No images yet — upload your first one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <div className="relative aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
                {!img.published && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-gray-900/80 text-white px-2 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-3">
                {img.caption && <p className="text-xs text-gray-600 truncate mb-2">{img.caption}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(img.id, img.published)}
                    disabled={busyId === img.id}
                    className="flex-1 text-xs font-medium px-2 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
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
