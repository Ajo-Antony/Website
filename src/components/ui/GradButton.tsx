import Link from "next/link";
import { ReactNode } from "react";

interface GradButtonProps { children: ReactNode; href: string; ghost?: boolean }

export default function GradButton({ children, href, ghost }: GradButtonProps) {
  const style: React.CSSProperties = ghost
    ? { fontFamily: "var(--font-mono,monospace)", fontSize: "0.78rem", letterSpacing: "0.06em", padding: "0.9rem 2.25rem", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", color: "var(--text-muted)", textDecoration: "none", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: "0.5rem" }
    : { fontFamily: "var(--font-mono,monospace)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.9rem 2.25rem", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", color: "#fff", textDecoration: "none", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 24px var(--shadow-strong)" };
  return <Link href={href} style={style}>{children}</Link>;
}
