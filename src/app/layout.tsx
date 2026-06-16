import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavbarCommonSharedComponent from "@/components/pages/commonSharedComponents/NavbarCommonSharedComponent";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
import GsapScripts from "@/components/ui/GsapScripts";
import AnimationBoot from "@/components/ui/AnimationBoot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StrixMind — AI-Powered Business Operating System",
  description: "AI-powered CRM, WhatsApp automation, lead management, multi-agent workflows, and revenue intelligence — all in one platform built for Indian businesses.",
  keywords: ["AI CRM", "WhatsApp automation", "business automation", "AI agents", "India", "workflow automation"],
  openGraph: {
    title: "StrixMind — AI-Powered Business Operating System",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <GsapScripts />
      </head>
      <body style={{ background: "#051A1C", overflowX: "hidden" }}>
        {/* Reading progress bar */}
        <div
          id="strix-progress-bar"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
            background: "linear-gradient(90deg, #0063E5, #6aabff)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            pointerEvents: "none",
          }}
        />
        <AnimationBoot />
        <NavbarCommonSharedComponent />
        <main>{children}</main>
        <FooterCommonSharedComponent />
      </body>
    </html>
  );
}
