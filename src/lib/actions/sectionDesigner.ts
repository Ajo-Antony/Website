"use server";

// src/lib/actions/sectionDesigner.ts
// ─────────────────────────────────────────────────────────────
// Server actions for reading and writing section design data.
// Used by the admin Section Designer and the public pages.
// ─────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SectionDesign, SectionDesignUpdate, DesignSettings } from "@/lib/types/sectionDesigner";

// Default fallback when Supabase has no row yet
const DEFAULT_DESIGN: DesignSettings = {};

/** Fetch all section designs for a given page, ordered by sort_order */
export async function getSectionDesigns(page: string): Promise<SectionDesign[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_designs")
      .select("*")
      .eq("page", page)
      .order("sort_order", { ascending: true });

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

/** Toggle visibility of a section */
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

    // Revalidate the correct public page
    const page = sectionKey.split(".")[0];
    revalidatePath(page === "home" ? "/" : `/${page}`);
    revalidatePath("/admin/section-designer");
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
    revalidatePath(page === "home" ? "/" : `/${page}`);
    revalidatePath("/admin/section-designer");
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

    // Upsert each row's sort order
    for (const u of updates) {
      const { error } = await supabase
        .from("section_designs")
        .update({ sort_order: u.sort_order, updated_at: u.updated_at })
        .eq("section_key", u.section_key);
      if (error) return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/section-designer");
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
