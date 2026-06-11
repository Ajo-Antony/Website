"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Platform", href: "/#demo" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export default function NavbarCommonSharedComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      const hash = window.location.hash || "/";
      setActiveHash(hash === "" ? "/" : hash);
    };
    fn();
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return activeHash === "/";
    return activeHash === href.replace("/", "");
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "transparent",
      padding: "1.25rem 2rem",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: "1.2rem", fontWeight: 800, color: "#fff",
          textDecoration: "none", letterSpacing: "-0.04em",
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          <span style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg,#0A5C68,#14b8a6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.875rem", color: "#fff",
          }}>S</span>
          Strix<span style={{ color: "#2DD4BF" }}>Mind</span>
        </Link>

        {/* Pill nav — desktop */}
        <div className="hidden md:flex" style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 100,
          padding: "0.35rem 0.5rem",
          display: "flex", alignItems: "center", gap: "0.15rem",
        }}>
          {LINKS.map(l => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setActiveHash(l.href === "/" ? "/" : l.href.replace("/", ""))}
                style={{
                  fontSize: "0.875rem", fontWeight: active ? 700 : 500,
                  padding: "0.45rem 1.1rem",
                  borderRadius: 100,
                  textDecoration: "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  background: active ? "#0A5C68" : "transparent",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap" as const,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)"; }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* CTA — desktop */}
        <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="#contact" style={{
            fontSize: "0.875rem", fontWeight: 600,
            color: "rgba(255,255,255,0.7)", textDecoration: "none",
            padding: "0.5rem 1.25rem",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          >
            Sign in
          </Link>
          <Link href="/booking" style={{
            fontSize: "0.875rem", fontWeight: 700,
            padding: "0.6rem 1.5rem",
            background: "#0A5C68",
            color: "#fff", borderRadius: 100, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(10,92,104,0.45)",
            transition: "all 0.25s ease",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0e7a8a"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A5C68"; (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}
          >
            Get In Touch →
          </Link>
        </div>

        {/* Hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 1.5, background: "#fff", borderRadius: 2, transition: "all 0.3s" }} />)}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          marginTop: "0.75rem", borderRadius: 20,
          background: "rgba(11,21,18,0.97)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: "1.25rem 1.5rem 1.75rem",
        }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", fontSize: "0.95rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", padding: "0.65rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setOpen(false)}
            style={{ display: "block", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, padding: "0.875rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", marginTop: "1rem" }}>
            Get In Touch →
          </Link>
        </div>
      )}
    </nav>
  );
}