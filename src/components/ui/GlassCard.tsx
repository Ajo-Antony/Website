import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  strong?: boolean;
  radius?: number;
  hover?: boolean;
}

export default function GlassCard({ children, style, strong, radius = 24, hover }: GlassCardProps) {
  const base: CSSProperties = {
    background: strong ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.55)",
    backdropFilter: strong ? "blur(28px) saturate(200%)" : "blur(20px) saturate(180%)",
    WebkitBackdropFilter: strong ? "blur(28px) saturate(200%)" : "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: strong ? "0 12px 48px rgba(99,88,210,0.18)" : "0 8px 32px rgba(99,88,210,0.10)",
    borderRadius: radius,
    transition: hover ? "transform 0.25s, box-shadow 0.25s" : undefined,
    ...style,
  };
  return <div style={base}>{children}</div>;
}
