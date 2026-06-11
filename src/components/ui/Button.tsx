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
    ...(variant === "solid" ? { background: "#0A5C68", color: "#fff", boxShadow: "0 8px 24px rgba(10,92,104,0.3)" }
      : variant === "ghost" ? { background: "#D8E8E5", color: "#0A5C68", border: "1.5px solid rgba(10,92,104,0.2)" }
      : { background: "transparent", color: "#0A5C68", border: "1.5px solid #0A5C68" }),
  };
  return href ? <Link href={href} style={style}>{children}</Link> : <button style={style} onClick={onClick}>{children}</button>;
}
