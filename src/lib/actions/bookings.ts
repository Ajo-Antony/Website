"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from "@/lib/email";

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
  emailSent?: boolean;
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

  const company = input.company?.trim() || null;
  const size = input.size?.trim() || null;
  const goal = input.goal?.trim() || null;

  const { error } = await supabase.from("bookings").insert({
    slot,
    name,
    email,
    company,
    size,
    goal,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Email sending is best-effort: the booking is already saved at this
  // point, so we don't fail the whole request if Resend isn't configured
  // or the send fails — we just let the caller know via emailSent.
  const emailResult = await sendBookingConfirmationEmail({ name, email, slot, company, size, goal });
  void sendBookingNotificationEmail({ name, email, slot, company, size, goal });

  return { ok: true, emailSent: emailResult.ok };
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
 * Fetches only the slots of existing bookings.
 * Since RLS might restrict select on bookings for anonymous users, we handle errors gracefully.
 * Note: If admins want this to work fully on the client side, they can add a policy:
 * CREATE POLICY "public_read_bookings_slots" ON bookings FOR SELECT USING (true);
 */
export async function getPublicBookedSlots(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("slot");

  if (error) {
    console.warn("Public select on bookings failed or was blocked by RLS:", error.message);
    return [];
  }
  return (data ?? []).map((b: { slot: string }) => b.slot);
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
