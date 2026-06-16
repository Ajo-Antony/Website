"use client";
import Link from "next/link";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";

const LINKS = {
  "Product": [
    { label: "Features", href: "/#features" },
    { label: "Platform Demo", href: "/#demo" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  "Use Cases": [
    { label: "WhatsApp Automation", href: "/#features" },
    { label: "AI CRM", href: "/#features" },
    { label: "Lead Generation", href: "/#features" },
    { label: "Campaign Outreach", href: "/#features" },
    { label: "Revenue Analytics", href: "/#features" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Brand Identity", href: "/#brand" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/#contact" },
    { label: "Kerala, India 🇮🇳", href: "/" },
  ],
  "Support": [
    { label: "Documentation", href: "/docs" },
    { label: "FAQ", href: "/#faq" },
    { label: "Book a Demo", href: "/booking" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIALS = [
  { label: "X", href: "https://x.com/strixmind" },
  { label: "LinkedIn", href: "https://linkedin.com/company/strixmind" },
  { label: "GitHub", href: "https://github.com/strixmind" },
  { label: "YouTube", href: "https://youtube.com/@strixmind" },
];

export default function FooterCommonSharedComponent() {
  return (
    <footer style={{ background: "#051A1C", color: "#fff", paddingTop: "5rem" }}>
      {/* Top gradient accent */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #0063E5, #003E8F, #0063E5)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 0" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: "3rem", paddingBottom: "4rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Brand col */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", marginBottom: "1.5rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#051A1C", border: "1px solid rgba(0,99,229,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StrixmindIcon size={26} theme="dark" />
              </div>
              <span style={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", fontSize: "1.1rem" }}>
                strix<span style={{ color: "#0063E5" }}>mind</span>
              </span>
            </Link>

            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: "1.75rem", maxWidth: 240 }}>
              AI-powered business automation for Indian businesses. Scale without limits.
            </p>

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.6)", animation: "pulse 2s infinite" }} />
              All systems operational
            </div>

            <Link href="/booking" style={{ display: "inline-flex", fontSize: "0.85rem", fontWeight: 700, color: "#fff", background: "#0063E5", padding: "0.65rem 1.5rem", borderRadius: 100, textDecoration: "none", boxShadow: "0 0 20px rgba(0,99,229,0.3)", transition: "all 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0052c2"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0063E5"; }}>
              Start Free Trial →
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}>{heading}</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.7rem" }}>
                {items.map(item => (
                  <Link key={item.label} href={item.href}
                    style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 0", flexWrap: "wrap" as const, gap: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} StrixMind Technologies Pvt. Ltd. · Made with ❤️ in Kerala, India
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
