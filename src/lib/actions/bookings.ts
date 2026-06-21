"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateBookingInput {
  slot: string;
  name: string;
  email: string;
  company?: string;
  size?: string;
  goal?: string;
}

export interface CreateBookingResult {
  ok: boolean;
  error?: string;
}

/**
 * Inserts a new row into the `bookings` table.
 * Called from the public /booking form (client component), so this runs
 * with the anon Supabase key — the `public_insert_bookings` RLS policy
 * on the `bookings` table allows inserts from anyone.
 */
export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const slot = input.slot?.trim();
  const name = input.name?.trim();
  const email = input.email?.trim();

  if (!slot) return { ok: false, error: "Please pick a time slot." };
  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("bookings").insert({
    slot,
    name,
    email,
    company: input.company?.trim() || null,
    size: input.size?.trim() || null,
    goal: input.goal?.trim() || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/**
 * Fetches all bookings, newest first. Used by the admin dashboard.
 * RLS only allows this for authenticated (admin) sessions.
 */
export async function getBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Updates a booking's status (new | contacted | scheduled | closed).
 */
export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/bookings");
  return { ok: true };
}

/**
 * Deletes a booking.
 */
export async function deleteBooking(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/bookings");
  return { ok: true };
}
