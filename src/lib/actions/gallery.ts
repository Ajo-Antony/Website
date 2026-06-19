"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadGalleryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const caption = String(formData.get("caption") ?? "").trim();

  if (!file || file.size === 0) {
    return { error: "Choose an image file first." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

  const { error: insertError } = await supabase.from("gallery_images").insert({
    url: urlData.publicUrl,
    storage_path: path,
    caption: caption || null,
    alt: caption || file.name,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
  return { success: true };
}

export async function deleteGalleryImage(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("gallery_images").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
}

export async function toggleGalleryPublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("gallery_images").update({ published }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
}
