/**
 * src/app/admin/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Admin Overview page — the landing screen after login.
 * Shows live counts for gallery images, blog posts, and projects
 * pulled from Supabase, rendered as clickable stat cards.
 *
 * ROUTE:    /admin
 * AUTH:     Double-guarded:
 *           1. middleware.ts redirects unauthenticated requests
 *              to /admin/login before this page even loads.
 *           2. Server component calls getUser() for a verified
 *              identity check (defence-in-depth).
 * ─────────────────────────────────────────────────────────────
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import { IconGallery, IconEdit, IconBriefcase, IconClock, IconInbox } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface StatCard {
  label: string;
  count: number;
  href: string;
  Icon: ElementType<{ size?: number; color?: string }>;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Server-side auth guard — verifies with Supabase, not just the cookie.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: galleryCount }, { count: blogCount }, { count: projectCount }, { count: bookingCount }, { count: reviewCount }] = await Promise.all([
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const cards: StatCard[] = [
    { label: "Bookings",          count: bookingCount ?? 0, Icon: IconClock,     href: "/admin/bookings" },
    { label: "Reviews (pending)", count: reviewCount  ?? 0, Icon: IconInbox,     href: "/admin/reviews"  },
    { label: "Gallery images",    count: galleryCount ?? 0, href: "/admin/gallery", Icon: IconGallery },
    { label: "Blog posts",        count: blogCount    ?? 0, href: "/admin/blog",    Icon: IconEdit },
    { label: "Projects",          count: projectCount ?? 0, href: "/admin/projects",Icon: IconBriefcase },
  ];

  return (
    <AdminShell active="/admin">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Overview</h1>
      <p className="text-sm text-gray-500 mb-8">Manage everything that shows up on strixmind.ai/work.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-[var(--surface)] rounded-2xl border border-gray-200 p-6 hover:border-accent/40 hover:shadow-lg transition-all group"
          >
            <div
              className="mb-3 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(108,99,255,0.07)", transition: "background 0.3s" }}
            >
              <c.Icon size={20} color="#6c63ff" />
            </div>
            <div className="text-3xl font-extrabold text-ink">{c.count}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
