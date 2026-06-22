/**
 * AdminShell.tsx  (UPDATED — adds Section Designer nav item)
 * src/components/pages/adminPage/AdminShell.tsx
 */
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";
import {
  IconOverview, IconContent, IconGallery, IconEdit, IconBriefcase, IconPalette, IconExternalLink, IconClock, IconInbox,
} from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface NavItem {
  href: string;
  label: string;
  Icon: ElementType<{ size?: number; color?: string }>;
}

const NAV: NavItem[] = [
  { href: "/admin",                  label: "Overview",          Icon: IconOverview  },
  { href: "/admin/content",          label: "Site Content",      Icon: IconContent   },
  { href: "/admin/section-designer", label: "Section Designer",  Icon: IconPalette   },
  { href: "/admin/bookings",         label: "Bookings",          Icon: IconClock     },
  { href: "/admin/reviews",          label: "Reviews",           Icon: IconInbox     },
  { href: "/admin/gallery",          label: "Gallery",           Icon: IconGallery   },
  { href: "/admin/blog",             label: "Blog",              Icon: IconEdit      },
  { href: "/admin/projects",         label: "Projects",          Icon: IconBriefcase },
];

export default function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(180deg,#f7f6fd,#eef0fb)" }}>
      <aside className="w-64 shrink-0 text-white flex flex-col" style={{ background: "linear-gradient(165deg,#241c4d,#1a1333)" }}>
        <div className="px-6 py-6 border-b border-white/10">
          <StrixmindWordmark theme="dark" height={20} />
          <div className="text-xs text-white/40 mt-1">Content dashboard</div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = active === item.href || (item.href !== "/admin" && active.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)]"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.Icon size={16} color={isActive ? "#fff" : "rgba(255,255,255,0.65)"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
          <Link href="/work" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <IconExternalLink size={16} color="rgba(255,255,255,0.65)" />
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-8 md:p-10">{children}</main>
    </div>
  );
}
