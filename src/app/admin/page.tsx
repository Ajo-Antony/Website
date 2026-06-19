import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: galleryCount }, { count: blogCount }, { count: projectCount }] = await Promise.all([
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Gallery images", count: galleryCount ?? 0, href: "/admin/gallery", icon: "🖼️" },
    { label: "Blog posts", count: blogCount ?? 0, href: "/admin/blog", icon: "📝" },
    { label: "Projects", count: projectCount ?? 0, href: "/admin/projects", icon: "💼" },
  ];

  return (
    <AdminShell active="/admin">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Overview</h1>
      <p className="text-sm text-gray-500 mb-8">Manage everything that shows up on strixmind.ai/work.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-accent/40 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-3">{c.icon}</div>
            <div className="text-3xl font-extrabold text-ink">{c.count}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
