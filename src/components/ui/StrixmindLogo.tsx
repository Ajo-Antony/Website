"use client";
import React from "react";

interface StrixmindLogoProps {
  size?: number;
  variant?: "icon" | "full" | "wordmark";
  theme?: "dark" | "light";
  className?: string;
}

// The abstract logo: central blue node with surrounding connected nodes
// Based on the branding PDF: Connected Intelligence — central node = AI intelligence,
// surrounding nodes = data, ML, agents, digital systems
export function StrixmindIcon({ size = 36, theme = "dark" }: { size?: number; theme?: "dark" | "light" }) {
  const accent = "#6c63ff";
  const center = "#6c63ff";
  const nodeLight = theme === "dark" ? "#FFFFFF" : "#FFFFFF";
  const nodeDark = theme === "dark" ? "#212121" : "#212121";
  const lineColor = theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,62,143,0.4)";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines first (behind nodes) */}
      <line x1="24" y1="24" x2="24" y2="8" stroke={lineColor} strokeWidth="1.5" />
      <line x1="24" y1="24" x2="38" y2="16" stroke={lineColor} strokeWidth="1.5" />
      <line x1="24" y1="24" x2="38" y2="32" stroke={lineColor} strokeWidth="1.5" />
      <line x1="24" y1="24" x2="24" y2="40" stroke={lineColor} strokeWidth="1.5" />
      <line x1="24" y1="24" x2="10" y2="32" stroke={lineColor} strokeWidth="1.5" />
      <line x1="24" y1="24" x2="10" y2="16" stroke={lineColor} strokeWidth="1.5" />

      {/* Outer satellite nodes */}
      {/* Top */}
      <circle cx="24" cy="8" r="4" fill={nodeLight} stroke={lineColor} strokeWidth="1" />
      {/* Top-right */}
      <circle cx="38" cy="16" r="3.5" fill={nodeDark} stroke={lineColor} strokeWidth="1" />
      {/* Bottom-right */}
      <circle cx="38" cy="32" r="4" fill={nodeLight} stroke={lineColor} strokeWidth="1" />
      {/* Bottom */}
      <circle cx="24" cy="40" r="3.5" fill={nodeDark} stroke={lineColor} strokeWidth="1" />
      {/* Bottom-left */}
      <circle cx="10" cy="32" r="4" fill={nodeLight} stroke={lineColor} strokeWidth="1" />
      {/* Top-left */}
      <circle cx="10" cy="16" r="3.5" fill={nodeDark} stroke={lineColor} strokeWidth="1" />

      {/* Central node — the AI intelligence core */}
      <circle cx="24" cy="24" r="8" fill={center} />
      <circle cx="24" cy="24" r="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="2" fill="white" />
    </svg>
  );
}

// The wordmark SVG — "strixmind" lowercase with custom letterforms
export function StrixmindWordmark({ height = 22, theme = "dark" }: { height?: number; theme?: "dark" | "light" }) {
  const color = theme === "dark" ? "#FFFFFF" : "#1a1333";
  const accent = "#6c63ff";
  return (
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800,
      fontSize: height,
      letterSpacing: "-0.04em",
      color: color,
      display: "inline-flex",
      alignItems: "center",
    }}>
      strix<span style={{ color: accent }}>mind</span>
    </span>
  );
}

// Combined icon + wordmark lockup
export default function StrixmindLogo({ size = 36, variant = "full", theme = "dark" }: StrixmindLogoProps) {
  if (variant === "icon") return <StrixmindIcon size={size} theme={theme} />;
  if (variant === "wordmark") return <StrixmindWordmark height={size * 0.55} theme={theme} />;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <StrixmindIcon size={size * 0.72} theme="dark" />
      </div>
      <StrixmindWordmark height={size * 0.5} theme={theme} />
    </div>
  );
}
