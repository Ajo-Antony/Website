/**
 * AdminShell.tsx  (UPDATED — adds Section Designer nav item)
 * src/components/pages/adminPage/AdminShell.tsx
 */
"use client";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";
import { useTheme } from "@/components/Theme/ThemeProvider";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import {
  IconOverview, IconContent, IconGallery, IconEdit, IconBriefcase, IconPalette, IconExternalLink, IconClock, IconInbox, IconMessage,
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
  { href: "/admin/comments",         label: "Comments",          Icon: IconMessage   },
  { href: "/admin/projects",         label: "Projects",          Icon: IconBriefcase },
];

function SidebarContent({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <div className="px-6 py-6 border-b border-[var(--border)]">
        <StrixmindWordmark theme={isDark ? "dark" : "light"} height={20} />
        <div className="text-xs text-[var(--text-dim)] mt-1">Content dashboard</div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = active === item.href || (item.href !== "/admin" && active.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-[0_4px_16px_var(--shadow-strong)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]"
              }`}
            >
              <item.Icon size={16} color={isActive ? "#fff" : "var(--text-dim)"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border)] flex flex-col gap-1">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">Theme</span>
          <ThemeToggle />
        </div>
        <Link
          href="/work"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)] transition-colors"
        >
          <IconExternalLink size={16} color="var(--text-dim)" />
          View site
        </Link>
        <form action={logout}>
          <button type="submit" className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)] transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--hero-bg)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-64 shrink-0 flex-col border-r border-[var(--border)]"
        style={{ background: "linear-gradient(165deg, var(--hero-panel), var(--hero-panel-2))" }}
      >
        <SidebarContent active={active} />
      </aside>

      {/* Mobile off-canvas sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[80vw] flex flex-col shadow-2xl border-r border-[var(--border)] transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ background: "linear-gradient(165deg, var(--hero-panel), var(--hero-panel-2))" }}
        >
          <SidebarContent active={active} onNavigate={() => setMobileOpen(false)} />
        </aside>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div
          className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[var(--border)] text-[var(--text)]"
          style={{ background: "linear-gradient(165deg, var(--hero-panel), var(--hero-panel-2))" }}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <StrixmindWordmark theme={isDark ? "dark" : "light"} height={18} />
          <div className="w-10" />
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
