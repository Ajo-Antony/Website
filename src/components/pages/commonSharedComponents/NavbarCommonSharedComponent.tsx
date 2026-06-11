"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(216,232,229,0.85)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(10,92,104,0.08)",
    boxShadow: scrolled ? "0 4px 24px rgba(10,92,104,0.10)" : "none",
    transition: "all 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", textDecoration: "none", letterSpacing: "-0.03em" }}>
          Strix<span style={{ color: "#0A5C68" }}>Mind</span>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none" }} className="hidden md:flex">
          {LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0A5C68")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }} className="hidden md:flex">
          <Link href="#contact" style={{ fontSize: "0.875rem", fontWeight: 600, padding: "0.6rem 1.5rem", border: "1.5px solid #0A5C68", color: "#0A5C68", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease", background: "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A5C68"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#0A5C68"; }}>
            Sign in
          </Link>
          <Link href="/booking" style={{ fontSize: "0.875rem", fontWeight: 600, padding: "0.6rem 1.5rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", boxShadow: "0 4px 16px rgba(10,92,104,0.3)", transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0e7a8a"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A5C68"; (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}>
            Start Free Trial
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 1.5, background: "#0F172A", borderRadius: 2 }} />)}
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid #E5E7EB", padding: "1.25rem 2rem 1.75rem" }} className="md:hidden">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", fontSize: "0.95rem", fontWeight: 500, color: "#64748B", textDecoration: "none", padding: "0.6rem 0", borderBottom: "1px solid #f1f5f9" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setOpen(false)}
            style={{ display: "block", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, padding: "0.875rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", marginTop: "1rem" }}>
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
