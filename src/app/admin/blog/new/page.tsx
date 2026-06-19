import AdminShell from "@/components/pages/adminPage/AdminShell";
import BlogPostForm from "@/components/pages/adminPage/BlogPostForm";
import { createBlogPost } from "@/lib/actions/blog";

export default function NewBlogPostPage() {
  return (
    <AdminShell active="/admin/blog">
      <h1 className="text-2xl font-extrabold text-ink mb-6">New post</h1>
      <BlogPostForm action={createBlogPost} />
    </AdminShell>
  );
}
