import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import DeleteButton from "@/components/pages/adminPage/DeleteButton";
import { deleteBlogPost } from "@/lib/actions/blog";
import type { BlogPost } from "@/lib/types/content";

export default async function AdminBlogListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  const posts = (data ?? []) as BlogPost[];

  return (
    <AdminShell active="/admin/blog">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink mb-1">Blog</h1>
          <p className="text-sm text-gray-500">Posts shown on strixmind.ai/work/blog.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-[0_8px_20px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts yet — create your first one.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between px-6 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink truncate">{post.title}</span>
                  {!post.published && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">/work/blog/{post.slug}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <DeleteButton id={post.id} action={deleteBlogPost} confirmText="Delete this post? This can't be undone." />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
