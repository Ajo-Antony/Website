"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import type { ContentValue } from "@/lib/cms/types";

/**
 * Deep-merge helper: DB values win over defaults.
 * Arrays are replaced entirely (not concatenated) because
 * a saved `members` array should fully replace the default one.
 */
function mergeContent(fallback: ContentValue, saved: ContentValue): ContentValue {
  if (typeof saved !== "object" || saved === null || Array.isArray(saved)) return saved ?? fallback;
  if (typeof fallback !== "object" || fallback === null || Array.isArray(fallback)) return saved;

  const result: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const key of Object.keys(saved as Record<string, unknown>)) {
    const savedVal = (saved as Record<string, unknown>)[key];
    const fallbackVal = (fallback as Record<string, unknown>)[key];
    // Arrays: saved value wins entirely (replaces default array)
    if (Array.isArray(savedVal)) {
      result[key] = savedVal;
    } else if (
      savedVal !== null &&
      typeof savedVal === "object" &&
      typeof fallbackVal === "object" &&
      fallbackVal !== null &&
      !Array.isArray(fallbackVal)
    ) {
      result[key] = mergeContent(fallbackVal as ContentValue, savedVal as ContentValue);
    } else {
      result[key] = savedVal;
    }
  }
  return result as ContentValue;
}

/** Reads one section's content, falling back to the built-in default if the
 *  row doesn't exist yet (e.g. fresh database) or Supabase is unreachable. */
export async function getContent(key: string): Promise<ContentValue> {
  const fallback = CONTENT_DEFAULTS[key] ?? {};
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
    if (data?.value) return mergeContent(fallback, data.value as ContentValue);
  } catch {
    // Network/config issue — fall through to defaults so the site still renders.
  }
  return fallback;
}

/** Reads several sections at once (one round trip). */
export async function getContentMany(keys: string[]): Promise<Record<string, ContentValue>> {
  const result: Record<string, ContentValue> = {};
  for (const k of keys) result[k] = CONTENT_DEFAULTS[k] ?? {};
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("key, value").in("key", keys);
    for (const row of data ?? []) {
      result[row.key] = mergeContent(result[row.key] ?? {}, row.value as ContentValue);
    }
  } catch {
    // fall back to defaults already populated above
  }
  return result;
}

const REVALIDATE_PATHS: Record<string, string[]> = {
  home: ["/"],
  about: ["/about"],
  services: ["/services"],
  contact: ["/contact"],
  booking: ["/booking"],
  work: ["/work"],
  global: ["/", "/about", "/services", "/contact", "/booking", "/work"],
};

function revalidateForKey(key: string) {
  const prefix = key.split(".")[0];
  for (const p of REVALIDATE_PATHS[prefix] ?? []) revalidatePath(p);
  revalidatePath("/admin/content/" + key);
}

export async function updateContent(key: string, value: ContentValue): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return { error: error.message };
  revalidateForKey(key);
  return {};
}

export async function resetContent(key: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("site_content").delete().eq("key", key);
  if (error) return { error: error.message };
  revalidateForKey(key);
  return {};
}

export async function uploadContentImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image file first." };

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `content/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
