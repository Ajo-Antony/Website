"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

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
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/work/blog");
}
