/**
 * src/app/layout.tsx
 * Root layout — wraps EVERY page on the site.
 *
 * PERF FIXES:
 * 1. Added `export const revalidate = 60` — layout Supabase calls
 *    (global.nav, global.footer) are now cached at the edge for 60s
 *    instead of running on every single request.
 * 2. Trimmed Inter font weights from 7 → 4 weights. Each weight is a
 *    separate woff2 download (~20-30KB). Dropped 300, 800, 900 which
 *    are rarely used in the UI.
 */
export const revalidate = 60;

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import SiteHeader from "@/components/ui/site-header";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
import GsapScripts from "@/components/ui/GsapScripts";
import AnimationBoot from "@/components/ui/AnimationBoot";
import { getContentMany } from "@/lib/actions/content";
import "./globals.css";

// PERF FIX: 7 weights → 4 weights. Saves ~3 font file round-trips (~80KB).
// If you need 300 (light) or 800/900 (heavy) somewhere, add them back.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StrixMind",
  description:
    "AI-powered CRM, WhatsApp automation, lead management, multi-agent workflows, and revenue intelligence — all in one platform built for Indian businesses.",
  keywords: [
    "AI CRM",
    "WhatsApp automation",
    "business automation",
    "AI agents",
    "India",
    "workflow automation",
  ],
  openGraph: {
    title: "StrixMind",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContentMany(["global.nav", "global.footer"]);
  const nav = content["global.nav"] as any;

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <GsapScripts />
      </head>
      <body suppressHydrationWarning>
        {/* Reading progress bar */}
        <div
          id="strix-progress-bar"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 9999,
            background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            pointerEvents: "none",
          }}
        />
        <AnimationBoot />

        <SiteHeader
          links={nav?.links}
          signInLabel={nav?.signInLabel}
          ctaLabel={nav?.ctaLabel}
          ctaHref={nav?.ctaHref}
        />

        <main>{children}</main>
        <FooterCommonSharedComponent {...(content["global.footer"] as any)} />
      </body>
    </html>
  );
}
