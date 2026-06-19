import Link from "next/link";
import { ReactNode } from "react";
interface ButtonProps { children: ReactNode; href?: string; onClick?: () => void; variant?: "solid" | "ghost" | "outline"; size?: "sm" | "md" | "lg" }
const sizes = { sm: "0.6rem 1.25rem", md: "0.875rem 2rem", lg: "1rem 2.25rem" };
export default function Button({ children, href, onClick, variant = "solid", size = "md" }: ButtonProps) {
  const style: React.CSSProperties = {
    fontSize: size === "sm" ? "0.8rem" : size === "lg" ? "1rem" : "0.875rem",
    fontWeight: 700, padding: sizes[size], borderRadius: 100, cursor: "pointer",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
    border: "none", fontFamily: "Inter, sans-serif", transition: "all 0.3s ease",
    ...(variant === "solid" ? { background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff", boxShadow: "0 8px 24px rgba(108,99,255,0.32)" }
      : variant === "ghost" ? { background: "#F4F2FE", color: "#4c46c4", border: "1.5px solid rgba(108,99,255,0.2)" }
      : { background: "transparent", color: "#6c63ff", border: "1.5px solid #6c63ff" }),
  };
  return href ? <Link href={href} style={style}>{children}</Link> : <button style={style} onClick={onClick}>{children}</button>;
}
