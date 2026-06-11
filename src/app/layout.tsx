import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavbarCommonSharedComponent from "@/components/pages/commonSharedComponents/NavbarCommonSharedComponent";
import FooterCommonSharedComponent from "@/components/pages/commonSharedComponents/FooterCommonSharedComponent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "StrixMind — AI-Powered Business Operating System",
  description: "AI-powered CRM, workflow automation, lead management, customer support, and business intelligence in one platform.",
  openGraph: {
    title: "StrixMind",
    description: "Automate Workflows. Scale Operations. Grow Without Limits.",
    siteName: "StrixMind",
    // images: ["/images/hero/og-image.jpg"],
  },
  twitter: { card: "summary_large_image", title: "StrixMind", description: "AI-Powered Business Operating System" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <NavbarCommonSharedComponent />
        <main>{children}</main>
        <FooterCommonSharedComponent />
      </body>
    </html>
  );
}
