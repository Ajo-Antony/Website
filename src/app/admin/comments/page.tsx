import AdminShell from "@/components/pages/adminPage/AdminShell";
import CommentModerator from "@/components/pages/adminPage/CommentModerator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell active="/admin/comments">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Comments</h1>
        <p className="text-sm text-[var(--text-muted)]">Moderate user-submitted feedback, questions, and replies across all blog posts and gallery items.</p>
      </div>
      <CommentModerator />
    </AdminShell>
  );
}
