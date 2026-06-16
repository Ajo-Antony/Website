"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Platform", href: "/#demo" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function NavbarCommonSharedComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (pathname === "/") return null;

  return (
    <nav
      data-strix-nav
      data-scrolled={scrolled ? "true" : undefined}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,26,28,0.97)" : "rgba(5,26,28,0.8)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,99,229,0.18)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.35)" : "none",
        transition: "all 0.35s ease",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#051A1C", border: "1px solid rgba(0,99,229,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <StrixmindIcon size={22} theme="dark" />
          </div>
          <span
            data-strix-logo-text
            style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", transition: "opacity 0.4s ease, max-width 0.5s ease", overflow: "hidden", whiteSpace: "nowrap" as const }}
          >
            strix<span style={{ color: "#0063E5" }}>mind</span>
          </span>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {LINKS.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="#contact"
            style={{ fontSize: "0.875rem", fontWeight: 600, padding: "0.55rem 1.35rem", border: "1.5px solid rgba(0,99,229,0.4)", color: "#6aabff", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,99,229,0.15)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            Sign in
          </Link>
          <Link
            href="/booking"
            style={{ fontSize: "0.875rem", fontWeight: 700, padding: "0.55rem 1.5rem", background: "#0063E5", color: "#fff", borderRadius: 100, textDecoration: "none", boxShadow: "0 0 20px rgba(0,99,229,0.35)", transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(0,99,229,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(0,99,229,0.35)"; }}
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}
