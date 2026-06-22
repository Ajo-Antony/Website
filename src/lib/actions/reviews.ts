"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  stars: number;
  status: ReviewStatus;
  initials: string;
  created_at: string;
}

/** Public: submit a new review (goes straight to pending) */
export async function submitReview(data: {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  stars: number;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const initials = data.name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const { error } = await supabase.from("reviews").insert({
    name: data.name,
    role: data.role ?? null,
    company: data.company ?? null,
    quote: data.quote,
    stars: data.stars,
    initials,
    status: "pending",
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  return { ok: true };
}

/** Admin: list all reviews (any status) */
export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

/** Public: list only approved reviews */
export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

/** Admin: approve a review */
export async function approveReview(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: !error };
}

/** Admin: reject a review */
export async function rejectReview(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ status: "rejected" })
    .eq("id", id);
  revalidatePath("/admin/reviews");
  return { ok: !error };
}

/** Admin: delete a review permanently */
export async function deleteReview(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: !error };
}
