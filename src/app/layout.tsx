/**
 * src/app/layout.tsx
 * ─────────────────────────────────────────────────────────────
 * Root layout — wraps EVERY page on the site.
 * Loads Inter + JetBrains Mono fonts, injects the shared
 * Navbar and Footer, adds a reading progress bar, and boots
 * GSAP scroll animations via AnimationBoot.
 *
 * AFFECTS:   All routes (/, /about, /services, /contact, /work/*, /admin/*)
 * CMS DATA:  global.nav + global.footer (fetched server-side on every request)
 * ─────────────────────────────────────────────────────────────
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import NavbarCommonSharedComponent from "@/components/pages/commonSharedComponents/NavbarCommonSharedComponent";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
import GsapScripts from "@/components/ui/GsapScripts";
import AnimationBoot from "@/components/ui/AnimationBoot";
import { getContentMany } from "@/lib/actions/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  title: "StrixMind — AI-Powered Business Operating System",
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
    title: "StrixMind — AI-Powered Business Operating System",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContentMany(["global.nav", "global.footer"]);

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <GsapScripts />
      </head>
      {/*
        suppressHydrationWarning on <body> silences the mismatch caused by
        browser extensions (dark-mode, reader-mode, password managers, etc.)
        that inject style/class attributes onto <body> before React hydrates.
        This is the officially recommended fix — it only suppresses the one
        attribute-level diff on <body> itself, not any of its children.
        https://nextjs.org/docs/messages/react-hydration-error
      */}
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
        <NavbarCommonSharedComponent {...(content["global.nav"] as any)} />
        <main>{children}</main>
        <FooterCommonSharedComponent {...(content["global.footer"] as any)} />
      </body>
    </html>
  );
}