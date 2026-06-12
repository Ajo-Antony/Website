"use client";
import Link from "next/link";

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
    { label: "Blog", href: "/blog" },
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

export default function FooterCommonSharedComponent() {
  return (
    <footer style={{ background: "#051A1C", color: "#fff", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: "3rem", paddingBottom: "4rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0A5C68", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9 L9 4 L14 9 L9 14 Z" fill="white" opacity="0.9"/><path d="M6.5 9 L9 6.5 L11.5 9 L9 11.5 Z" fill="#14b8a6"/></svg>
              </div>
              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>StrixMind</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: "1.75rem", maxWidth: 260 }}>
              AI-powered business automation for Indian businesses. Scale without limits.
            </p>
            <Link href="/booking" style={{ display: "inline-flex", fontSize: "0.85rem", fontWeight: 700, color: "#fff", background: "#0A5C68", padding: "0.65rem 1.5rem", borderRadius: 100, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              Start Free Trial →
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>{heading}</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.7rem" }}>
                {items.map(item => (
                  <Link key={item.label} href={item.href} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 0", flexWrap: "wrap" as const, gap: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} StrixMind Technologies Pvt. Ltd. · Made with ❤️ in Kerala, India
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Twitter/X", "LinkedIn", "GitHub", "YouTube"].map(s => (
              <a key={s} href="#" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
