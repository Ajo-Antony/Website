/**
 * src/app/layout.tsx
 * Root layout — wraps EVERY page on the site.
 * Uses new SiteHeader with dropdown navigation menu.
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { unstable_cache } from "next/cache";
import SiteHeader from "@/components/ui/site-header";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
import GsapScripts from "@/components/ui/GsapScripts";
import AnimationBoot from "@/components/ui/AnimationBoot";
import { getContentMany } from "@/lib/actions/content";
import "./globals.css";

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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://strixmind.in"),
  title: {
    default: "StrixMind — AI-Powered Business Operating System",
    template: "%s | StrixMind",
  },
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
  authors: [{ name: "StrixMind", url: "https://strixmind.in" }],
  creator: "StrixMind",
  publisher: "StrixMind",
  robots: { index: true, follow: true },
  openGraph: {
    title: "StrixMind — AI-Powered Business Operating System",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    type: "website",
    url: "https://strixmind.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrixMind — AI-Powered Business Operating System",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    site: "@strixmind",
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

// Cache nav+footer content for 1 hour — no need to re-fetch on every page load
const getCachedNavFooter = unstable_cache(
  async () => getContentMany(["global.nav", "global.footer"]),
  ["global-nav-footer"],
  { revalidate: 3600 }
);

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StrixMind",
  url: "https://strixmind.in",
  logo: "https://strixmind.in/brand/strixmind-wordmark.svg",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://strixmind.in/contact",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getCachedNavFooter();
  const nav = content["global.nav"] as any;

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <GsapScripts />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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

        {/* New header with dropdown navigation */}
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
