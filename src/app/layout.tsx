import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavbarCommonSharedComponent from "@/components/pages/commonSharedComponents/NavbarCommonSharedComponent";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
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
  keywords: ["AI CRM", "WhatsApp automation", "business automation", "AI agents", "India", "workflow automation", "lead management"],
  openGraph: {
    title: "StrixMind — AI-Powered Business Operating System",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrixMind",
    description: "AI-Powered Business Operating System for Indian businesses",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ background: "#051A1C" }}>
        <NavbarCommonSharedComponent />
        <main>{children}</main>
        <FooterCommonSharedComponent />
      </body>
    </html>
  );
}
