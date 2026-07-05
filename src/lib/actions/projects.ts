"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify, parseResultLines } from "@/lib/slugify";
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

function readCommonFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const status = String(formData.get("status") ?? "completed").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const resultsRaw = String(formData.get("results") ?? "");
  const link = String(formData.get("link") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const results = parseResultLines(resultsRaw);

  return { title, slugInput, client, category, year, status, summary, description, tags, results, link, featured, published };
}

export async function createProject(formData: FormData) {
  const f = readCommonFields(formData);
  if (!f.title) return { error: "Title is required." };

  const supabase = await createClient();
  const coverFile = formData.get("cover_image") as File | null;
  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverIfProvided(supabase, coverFile, "projects");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Cover image upload failed." };
  }

  const { error } = await supabase.from("projects").insert({
    title: f.title,
    slug: f.slugInput ? slugify(f.slugInput) : slugify(f.title),
    client: f.client || null,
    category: f.category || null,
    year: f.year || null,
    status: f.status,
    summary: f.summary || null,
    description: f.description,
    cover_image: coverUrl,
    tags: f.tags,
    results: f.results,
    link: f.link || null,
    featured: f.featured,
    published: f.published,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/work/projects");
  revalidatePath("/work");

  if (f.published) {
    const slug = f.slugInput ? slugify(f.slugInput) : slugify(f.title);
    submitToIndexNow([`${SITE_URL}/work/projects`, `${SITE_URL}/work/projects/${slug}`, `${SITE_URL}/work`]);
  }

  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const f = readCommonFields(formData);
  if (!f.title) return { error: "Title is required." };

  const supabase = await createClient();
  const coverFile = formData.get("cover_image") as File | null;
  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverIfProvided(supabase, coverFile, "projects");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Cover image upload failed." };
  }

  const update: Record<string, unknown> = {
    title: f.title,
    slug: f.slugInput ? slugify(f.slugInput) : slugify(f.title),
    client: f.client || null,
    category: f.category || null,
    year: f.year || null,
    status: f.status,
    summary: f.summary || null,
    description: f.description,
    tags: f.tags,
    results: f.results,
    link: f.link || null,
    featured: f.featured,
    published: f.published,
    updated_at: new Date().toISOString(),
  };
  if (coverUrl) update.cover_image = coverUrl;

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/work/projects");
  revalidatePath("/work");

  if (f.published) {
    const slug = f.slugInput ? slugify(f.slugInput) : slugify(f.title);
    submitToIndexNow([`${SITE_URL}/work/projects`, `${SITE_URL}/work/projects/${slug}`, `${SITE_URL}/work`]);
  }

  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/admin/projects");
  revalidatePath("/work/projects");
  revalidatePath("/work");
}
