"use server";

// src/lib/actions/sectionDesigner.ts
// ─────────────────────────────────────────────────────────────
// Server actions for reading and writing section design data.
// Used by the admin Section Designer and the public pages.
// ─────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/withTimeout";
import type { SectionDesign, SectionDesignUpdate, DesignSettings } from "@/lib/types/sectionDesigner";

// Default fallback when Supabase has no row yet
const DEFAULT_DESIGN: DesignSettings = {};

/** Resolve a section_key prefix to its public URL */
function getPublicPath(page: string): string {
  return page === "home" ? "/" : `/${page}`;
}

/** Fetch all section designs for a given page, ordered by sort_order.
 *  Public pages await this directly (alongside getContentMany), so a slow
 *  or unresponsive Supabase must not block the page — it falls back to []
 *  (meaning every section just renders with its default, un-customised
 *  styling) after a short timeout. */
export async function getSectionDesigns(page: string): Promise<SectionDesign[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("section_designs")
      .select("*")
      .eq("page", page)
      .order("sort_order", { ascending: true });

    const { data, error } = await withTimeout(query, 2500, { data: [], error: null } as any);
    if (error) throw error;
    return (data ?? []) as SectionDesign[];
  } catch {
    return [];
  }
}

/** Fetch all sections across all pages (for admin overview) */
export async function getAllSectionDesigns(): Promise<SectionDesign[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_designs")
      .select("*")
      .order("page")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SectionDesign[];
  } catch {
    return [];
  }
}

/** Get design settings for a single section */
export async function getSectionDesign(sectionKey: string): Promise<SectionDesign | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_designs")
      .select("*")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (error) throw error;
    return data as SectionDesign | null;
  } catch {
    return null;
  }
}

/**
 * Toggle visibility of a section.
 *
 * After writing to Supabase we aggressively revalidate both the
 * admin designer page AND the public page so the change is
 * reflected immediately without a manual redeploy.
 */
export async function toggleSectionVisibility(
  sectionKey: string,
  isVisible: boolean
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("section_designs")
      .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
      .eq("section_key", sectionKey);

    if (error) return { error: error.message };

    // Revalidate every path that might show this section
    const page = sectionKey.split(".")[0];
    const publicPath = getPublicPath(page);

    revalidatePath(publicPath, "page");          // public page — force re-render
    revalidatePath("/admin/section-designer", "page"); // admin designer
    revalidatePath("/admin", "layout");           // admin shell (just in case)

    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Update design settings for a section */
export async function updateSectionDesign(
  sectionKey: string,
  update: SectionDesignUpdate
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("section_designs")
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq("section_key", sectionKey);

    if (error) return { error: error.message };

    const page = sectionKey.split(".")[0];
    const publicPath = getPublicPath(page);

    revalidatePath(publicPath, "page");
    revalidatePath("/admin/section-designer", "page");

    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Reorder sections (drag-and-drop result) */
export async function reorderSections(
  orderedKeys: string[]
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const updates = orderedKeys.map((key, index) => ({
      section_key: key,
      sort_order: index + 1,
      updated_at: new Date().toISOString(),
    }));

    for (const u of updates) {
      const { error } = await supabase
        .from("section_designs")
        .update({ sort_order: u.sort_order, updated_at: u.updated_at })
        .eq("section_key", u.section_key);
      if (error) return { error: error.message };
    }

    revalidatePath("/", "page");
    revalidatePath("/admin/section-designer", "page");
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Upload a section image and return its URL */
export async function uploadSectionImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image file first." };

  try {
    const supabase = await createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `sections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) return { error: error.message };

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Reset section design to defaults */
export async function resetSectionDesign(
  sectionKey: string
): Promise<{ error?: string }> {
  return updateSectionDesign(sectionKey, { design: DEFAULT_DESIGN });
}