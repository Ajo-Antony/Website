import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn-style className combiner — used by the new ui/ components
// (aurora-background, scroll-reel-testimonials, display-cards, expandable-tabs)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cx = (...c: (string|undefined|false|null)[]) => c.filter(Boolean).join(" ");
export const formatINR = (n: number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export const truncate = (s: string, max: number) => s.length <= max ? s : s.slice(0,max).trimEnd()+"…";

export function getOrCreateSessionId() {
  if (typeof window === "undefined") return "server-side";
  let sessionId = localStorage.getItem("strixmind_session_id");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("strixmind_session_id", sessionId);
  }
  return sessionId;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#121214" offset="20%" />
      <stop stop-color="#1c1c22" offset="50%" />
      <stop stop-color="#121214" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#121214" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

import React from "react";

/**
 * Renders a heading string with the very last word styled in the beautiful
 * Instrument Serif italic font with the primary accent color.
 * Preserves newlines as <br /> tags.
 */
export function renderHeadingWithSerif(text: string): React.ReactNode {
  if (!text) return "";
  const lines = text.split("\n");
  return React.createElement(
    React.Fragment,
    null,
    lines.map((line, lineIdx) => {
      const isLastLine = lineIdx === lines.length - 1;
      if (!isLastLine) {
        return React.createElement(
          React.Fragment,
          { key: lineIdx },
          line,
          React.createElement("br", null)
        );
      }

      const words = line.trim().split(/\s+/);
      if (words.length === 0) return null;
      if (words.length === 1) {
        return React.createElement(
          "span",
          {
            key: lineIdx,
            style: {
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--accent)",
            },
          },
          words[0]
        );
      }

      const lastWord = words[words.length - 1];
      const initialWords = words.slice(0, words.length - 1).join(" ");

      return React.createElement(
        React.Fragment,
        { key: lineIdx },
        initialWords,
        " ",
        React.createElement(
          "span",
          {
            style: {
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--accent)",
            },
          },
          lastWord
        )
      );
    })
  );
}

