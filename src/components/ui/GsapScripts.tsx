"use client";
import Script from "next/script";

// Loads GSAP (free CDN), ScrollTrigger, and Lenis smooth scroll
// SplitText is GSAP Club — we implement our own lightweight word/line splitter instead
export default function GsapScripts() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
