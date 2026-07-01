import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import GalleryManager from "@/components/pages/adminPage/GalleryManager";
import type { GalleryImage } from "@/lib/types/content";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="/admin/gallery">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Gallery</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Images shown on strixmind.ai/work/gallery.</p>
      <GalleryManager images={(data ?? []) as GalleryImage[]} />
    </AdminShell>
  );
}
