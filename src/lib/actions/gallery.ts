"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadGalleryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const show_on_home = formData.get("show_on_home") === "true";
  
  const tags = tagsRaw 
    ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  if (!file || file.size === 0) {
    return { error: "Choose an image or video file first." };
  }

  const mime = file.type;
  let media_type: "image" | "video" = "image";
  if (mime.startsWith("video/")) {
    media_type = "video";
  } else {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext && ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) {
      media_type = "video";
    }
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
    title: title || null,
    caption: caption || null,
    tags,
    alt: title || caption || file.name,
    media_type,
    show_on_home,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryImage(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("gallery_images").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function toggleGalleryPublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("gallery_images").update({ published }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function toggleGalleryShowOnHome(id: string, show_on_home: boolean) {
  const supabase = await createClient();
  await supabase.from("gallery_images").update({ show_on_home }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/work/gallery");
  revalidatePath("/work");
  revalidatePath("/");
}

// ── GALLERY LIKES ──
export async function getGalleryLikesAndComments(gallery_image_id: string) {
  const supabase = await createClient();
  
  const { data: likes, error: likesError } = await supabase
    .from("gallery_likes")
    .select("session_id, user_id")
    .eq("gallery_image_id", gallery_image_id);

  let { data: comments, error: commentsError } = await supabase
    .from("gallery_comments")
    .select("*")
    .eq("gallery_image_id", gallery_image_id)
    .eq("approved", true)
    .eq("hidden", false)
    .order("created_at", { ascending: true });

  if (commentsError && (commentsError.message.includes("column") || commentsError.code === "PGRST204")) {
    const fallbackRes = await supabase
      .from("gallery_comments")
      .select("*")
      .eq("gallery_image_id", gallery_image_id)
      .order("created_at", { ascending: true });
    comments = fallbackRes.data;
    commentsError = fallbackRes.error;
  }

  return {
    likes: likes ?? [],
    comments: comments ?? [],
    likesCount: likes?.length ?? 0,
    error: likesError?.message || commentsError?.message || null
  };
}

export async function likeGalleryImage(gallery_image_id: string, session_id: string) {
  const supabase = await createClient();
  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("gallery_likes").insert({
    gallery_image_id,
    session_id,
    user_id: user?.id || null
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/work/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function unlikeGalleryImage(gallery_image_id: string, session_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from("gallery_likes").delete().eq("gallery_image_id", gallery_image_id);
  
  if (user) {
    query = query.or(`user_id.eq.${user.id},session_id.eq.${session_id}`);
  } else {
    query = query.eq("session_id", session_id);
  }

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePath("/work/gallery");
  revalidatePath("/");
  return { success: true };
}

// ── GALLERY COMMENTS ──
export async function addGalleryComment(gallery_image_id: string, author_name: string, content: string) {
  const trimmedName = author_name.trim();
  const trimmedContent = content.trim();

  if (!trimmedName || !trimmedContent) {
    return { error: "Name and comment content are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("gallery_comments").insert({
    gallery_image_id,
    author_name: trimmedName,
    content: trimmedContent,
    user_id: user?.id || null
  });

  if (error) return { error: error.message };

  revalidatePath("/work/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function getAdminGalleryComments(gallery_image_id?: string) {
  const supabase = await createClient();
  let query = supabase.from("gallery_comments").select("*").order("created_at", { ascending: false });
  if (gallery_image_id) {
    query = query.eq("gallery_image_id", gallery_image_id);
  }
  const { data, error } = await query;
  return { comments: data ?? [], error: error?.message || null };
}

export async function updateGalleryCommentStatus(id: string, approved: boolean, hidden: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_comments").update({ approved, hidden }).eq("id", id);
  revalidatePath("/work/gallery");
  revalidatePath("/");
  return { success: !error, error: error?.message || null };
}

export async function deleteGalleryComment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_comments").delete().eq("id", id);
  revalidatePath("/work/gallery");
  revalidatePath("/");
  return { success: !error, error: error?.message || null };
}
