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

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? "rgba(5,26,28,0.96)" : "rgba(5,26,28,0.82)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${scrolled ? "rgba(0,99,229,0.15)" : "rgba(255,255,255,0.06)"}`,
    boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.3)" : "none",
    transition: "all 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#051A1C", border: "1px solid rgba(0,99,229,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <StrixmindIcon size={22} theme="dark" />
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>
            strix<span style={{ color: "#0063E5" }}>mind</span>
          </span>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }} className="hidden md:flex">
          {LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href}
                style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="hidden md:flex">
          <Link href="#contact"
            style={{ fontSize: "0.875rem", fontWeight: 600, padding: "0.55rem 1.35rem", border: "1.5px solid rgba(0,99,229,0.4)", color: "#6aabff", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease", background: "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,99,229,0.15)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,99,229,0.7)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,99,229,0.4)"; }}>
            Sign in
          </Link>
          <Link href="/booking"
            style={{ fontSize: "0.875rem", fontWeight: 700, padding: "0.55rem 1.5rem", background: "#0063E5", color: "#fff", borderRadius: 100, textDecoration: "none", boxShadow: "0 0 20px rgba(0,99,229,0.35)", transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0052c2"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0063E5"; (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}>
            Start Free Trial
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
          {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 22, height: 1.5, background: "#fff", borderRadius: 2 }} />)}
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(5,26,28,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem 2rem 1.75rem" }} className="md:hidden">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", fontSize: "0.95rem", fontWeight: 500, color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "0.65rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setOpen(false)}
            style={{ display: "block", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, padding: "0.875rem", background: "#0063E5", color: "#fff", borderRadius: 100, textDecoration: "none", marginTop: "1rem", boxShadow: "0 0 20px rgba(0,99,229,0.35)" }}>
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
