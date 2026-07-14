"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/staticClient";
import { withTimeout } from "@/lib/withTimeout";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import type { ContentValue } from "@/lib/cms/types";

/**
 * Deep-merge: DB values win over defaults.
 * Arrays are replaced entirely — a saved `members` array fully
 * replaces the default one. This is intentional: the admin
 * explicitly chose those members.
 * 
 * IMPORTANT: we only replace with a DB array if it has at least one
 * non-empty item. A fully-empty array (e.g. []) defers to defaults.
 */
function isEmptyItem(item: unknown): boolean {
  if (typeof item !== "object" || item === null) return !item;
  return Object.values(item as Record<string, unknown>).every(
    (v) => v === "" || v === null || v === undefined || (Array.isArray(v) && v.length === 0)
  );
}

function mergeContent(fallback: ContentValue, saved: ContentValue): ContentValue {
  if (typeof saved !== "object" || saved === null || Array.isArray(saved)) return saved ?? fallback;
  if (typeof fallback !== "object" || fallback === null || Array.isArray(fallback)) return saved;

  const result: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const key of Object.keys(saved as Record<string, unknown>)) {
    const savedVal = (saved as Record<string, unknown>)[key];
    const fallbackVal = (fallback as Record<string, unknown>)[key];

    if (Array.isArray(savedVal)) {
      // Only use the saved array if it has at least one non-empty item
      const nonEmpty = savedVal.filter((item) => !isEmptyItem(item));
      result[key] = nonEmpty.length > 0 ? savedVal : (fallbackVal ?? savedVal);
    } else if (
      savedVal !== null &&
      typeof savedVal === "object" &&
      typeof fallbackVal === "object" &&
      fallbackVal !== null &&
      !Array.isArray(fallbackVal)
    ) {
      result[key] = mergeContent(fallbackVal as ContentValue, savedVal as ContentValue);
    } else {
      // For scalar fields: use saved value if non-empty, else keep fallback
      result[key] = (savedVal !== "" && savedVal !== null && savedVal !== undefined) ? savedVal : (fallbackVal ?? savedVal);
    }
  }
  return result as ContentValue;
}

/** Reads one section's content, falling back to the built-in default if the
 *  row doesn't exist yet (e.g. fresh database), Supabase is unreachable, or
 *  Supabase is slow to respond (public pages must never block on this). */
export async function getContent(key: string): Promise<ContentValue> {
  const fallback = CONTENT_DEFAULTS[key] ?? {};
  try {
    const supabase = createStaticClient();
    const query = supabase.from("site_content").select("value").eq("key", key).maybeSingle();
    const { data } = await withTimeout(query, 2500, { data: null } as any);
    if (data?.value) return mergeContent(fallback, data.value as ContentValue);
  } catch {
    // Network/config issue — fall through to defaults so the site still renders.
  }
  return fallback;
}

/** Reads several sections at once (one round trip). Public pages await this
 *  directly, so it must never hang — a slow/unresponsive Supabase falls
 *  back to defaults after a short timeout instead of blocking the page. */
export async function getContentMany(keys: string[]): Promise<Record<string, ContentValue>> {
  const result: Record<string, ContentValue> = {};
  for (const k of keys) result[k] = CONTENT_DEFAULTS[k] ?? {};
  try {
    const supabase = createStaticClient();
    const query = supabase.from("site_content").select("key, value").in("key", keys);
    const { data } = await withTimeout(query, 2500, { data: null } as any);
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

  // The root layout caches global.nav / global.footer in a separate,
  // long-lived data cache (unstable_cache) that revalidatePath alone
  // cannot bust. Explicitly invalidate it here so header/footer edits
  // show up immediately instead of waiting up to an hour.
  if (key === "global.nav" || key === "global.footer") {
    revalidateTag("global-nav-footer");
  }
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

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function uploadContentImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) return { error: "Choose an image file first." };
    if (file.size > MAX_UPLOAD_BYTES) return { error: "Image is too large (max 5MB)." };
    if (file.type && !ALLOWED_TYPES.has(file.type)) return { error: "Unsupported file type. Use PNG, JPG, WEBP, GIF, or SVG." };

    const supabase = await createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `content/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Guard against a hung/slow network call to Storage so this action
    // always resolves — never leaves the caller awaiting forever.
    const uploadPromise = supabase.storage.from("media").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    const { error } = await withTimeout(
      uploadPromise,
      15000,
      { error: { message: "Upload timed out. Check your connection and try again." } } as any
    );
    if (error) return { error: error.message };

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err) {
    // Never let this action throw — a rejected promise here is exactly
    // what causes the client's "Uploading…" button to hang forever.
    return { error: err instanceof Error ? err.message : "Upload failed unexpectedly." };
  }
}