/**
 * src/app/admin/reviews/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Admin — Review Approval queue.
 * All reviews submitted from the homepage land here as "pending".
 * Approve → appears live on site. Reject → hidden from site.
 *
 * ROUTE:  /admin/reviews
 * AUTH:   Middleware-protected + server-side getUser() guard.
 * ─────────────────────────────────────────────────────────────
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import ReviewsManager from "@/components/pages/adminPage/ReviewsManager";
import { getReviews } from "@/lib/actions/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const reviews = await getReviews();

  return (
    <AdminShell active="/admin/reviews">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Review Approvals</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Customer reviews submitted through the site. Approve to publish live.
      </p>
      <ReviewsManager reviews={reviews} />
    </AdminShell>
  );
}
