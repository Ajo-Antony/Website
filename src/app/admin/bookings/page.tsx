import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import BookingsManager from "@/components/pages/adminPage/BookingsManager";
import type { Booking } from "@/lib/types/content";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="/admin/bookings">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Bookings</h1>
      <p className="text-sm text-gray-500 mb-8">Demo requests submitted through strixmind.ai/booking.</p>
      <BookingsManager bookings={(data ?? []) as Booking[]} />
    </AdminShell>
  );
}
