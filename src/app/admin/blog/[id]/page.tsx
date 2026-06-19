import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import BlogPostForm from "@/components/pages/adminPage/BlogPostForm";
import { updateBlogPost } from "@/lib/actions/blog";
import type { BlogPost } from "@/lib/types/content";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();

  if (!data) notFound();

  const boundUpdate = updateBlogPost.bind(null, id);

  return (
    <AdminShell active="/admin/blog">
      <h1 className="text-2xl font-extrabold text-ink mb-6">Edit post</h1>
      <BlogPostForm post={data as BlogPost} action={boundUpdate} />
    </AdminShell>
  );
}
