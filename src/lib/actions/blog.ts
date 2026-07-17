"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { submitToIndexNow } from "@/lib/indexnow";

const SITE_URL = "https://www.strixmind.com";

async function uploadCoverIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
  folder: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export async function createBlogPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const published = formData.get("published") === "on";
  const coverFile = formData.get("cover_image") as File | null;

  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverIfProvided(supabase, coverFile, "blog");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Cover image upload failed." };
  }

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug: slugInput ? slugify(slugInput) : slugify(title),
    excerpt: excerpt || null,
    content,
    cover_image: coverUrl,
    published,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/work/blog");

  if (published) {
    const slug = slugInput ? slugify(slugInput) : slugify(title);
    submitToIndexNow([`${SITE_URL}/work/blog`, `${SITE_URL}/work/blog/${slug}`]);
  }

  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const published = formData.get("published") === "on";
  const coverFile = formData.get("cover_image") as File | null;

  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverIfProvided(supabase, coverFile, "blog");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Cover image upload failed." };
  }

  const update: Record<string, unknown> = {
    title,
    slug: slugInput ? slugify(slugInput) : slugify(title),
    excerpt: excerpt || null,
    content,
    published,
    updated_at: new Date().toISOString(),
  };
  if (coverUrl) update.cover_image = coverUrl;

  const { error } = await supabase.from("blog_posts").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/work/blog");

  if (published) {
    const slug = slugInput ? slugify(slugInput) : slugify(title);
    submitToIndexNow([`${SITE_URL}/work/blog`, `${SITE_URL}/work/blog/${slug}`]);
  }

  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/work/blog");
}

// ── BLOG LIKES ──
export async function getBlogLikesAndComments(blog_id: string) {
  const supabase = await createClient();
  
  const { data: likes, error: likesError } = await supabase
    .from("blog_likes")
    .select("session_id, user_id")
    .eq("blog_id", blog_id);

  let { data: comments, error: commentsError } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("blog_id", blog_id)
    .eq("approved", true)
    .eq("hidden", false)
    .order("created_at", { ascending: true });

  if (commentsError && (commentsError.message.includes("column") || commentsError.code === "PGRST204")) {
    const fallbackRes = await supabase
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blog_id)
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

export async function likeBlogPost(blog_id: string, session_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("blog_likes").insert({
    blog_id,
    session_id,
    user_id: user?.id || null
  });

  if (error) return { error: error.message };

  revalidatePath("/work/blog");
  return { success: true };
}

export async function unlikeBlogPost(blog_id: string, session_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from("blog_likes").delete().eq("blog_id", blog_id);

  if (user) {
    query = query.or(`user_id.eq.${user.id},session_id.eq.${session_id}`);
  } else {
    query = query.eq("session_id", session_id);
  }

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePath("/work/blog");
  return { success: true };
}

// ── BLOG COMMENTS ──
export async function addBlogComment(blog_id: string, author_name: string, content: string) {
  const trimmedName = author_name.trim();
  const trimmedContent = content.trim();

  if (!trimmedName || !trimmedContent) {
    return { error: "Name and comment content are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("blog_comments").insert({
    blog_id,
    author_name: trimmedName,
    content: trimmedContent,
    user_id: user?.id || null
  });

  if (error) return { error: error.message };

  revalidatePath("/work/blog");
  return { success: true };
}

export async function getAdminBlogComments(blog_id?: string) {
  const supabase = await createClient();
  let query = supabase.from("blog_comments").select("*").order("created_at", { ascending: false });
  if (blog_id) {
    query = query.eq("blog_id", blog_id);
  }
  const { data, error } = await query;
  return { comments: data ?? [], error: error?.message || null };
}

export async function updateBlogCommentStatus(id: string, approved: boolean, hidden: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_comments").update({ approved, hidden }).eq("id", id);
  revalidatePath("/work/blog");
  return { success: !error, error: error?.message || null };
}

export async function deleteBlogComment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_comments").delete().eq("id", id);
  revalidatePath("/work/blog");
  return { success: !error, error: error?.message || null };
}
