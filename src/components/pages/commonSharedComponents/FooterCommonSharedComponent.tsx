"use client";

import Link from "next/link";

export default function FooterCommonSharedComponent() {
  return (
    <footer style={{ background: "#0F172A", padding: "3rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <Link href="/" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", textDecoration: "none", letterSpacing: "-0.03em" }}>
          Strix<span style={{ color: "#5eead4" }}>Mind</span>
        </Link>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "2rem", listStyle: "none" }}>
          {["Features","Pricing","FAQ","Contact","Privacy","Terms"].map(item => (
            <li key={item}>
              <Link href={`/#${item.toLowerCase()}`} style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>© {new Date().getFullYear()} StrixMind LLP. All rights reserved.</p>
      </div>
    </footer>
  );
}
