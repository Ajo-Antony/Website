"use client";

import { ReactNode, CSSProperties } from "react";
interface CardProps { children: ReactNode; style?: CSSProperties; hover?: boolean; radius?: number }
export default function Card({ children, style, hover, radius = 24 }: CardProps) {
  return (
    <div style={{ background:"#fff", border:"1px solid #E5E0FA", borderRadius:radius, transition:hover?"all 0.4s ease":undefined, ...style }}
      {...(hover ? { onMouseEnter: e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(10,92,104,0.14)"; }, onMouseLeave: e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; } } : {})}>
      {children}
    </div>
  );
}
