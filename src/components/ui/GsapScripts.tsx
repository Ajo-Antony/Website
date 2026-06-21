"use client";
import Script from "next/script";

/**
 * PERF FIX: Changed all strategies from "beforeInteractive" → "afterInteractive"
 *
 * "beforeInteractive" blocks HTML parsing — the browser cannot render
 * ANYTHING until all three scripts download, parse and execute (~150KB).
 * That was the #1 cause of the Vercel lag.
 *
 * "afterInteractive" loads after the page is interactive. Animations
 * simply start slightly later (the poll in useGsapAnimations already
 * handles the delay gracefully — it retries every 100ms until GSAP is ready).
 */
export default function GsapScripts() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
