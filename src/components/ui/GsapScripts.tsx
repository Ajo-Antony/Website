/**
 * src/components/ui/GsapScripts.tsx
 * ─────────────────────────────────────────────────────────────
 * DEPRECATED — GSAP/ScrollTrigger/Lenis are now installed as npm
 * dependencies (see package.json) and dynamically imported directly
 * inside src/hooks/useGsapAnimations.ts, instead of being loaded as
 * three separate <script> tags from cdn.jsdelivr.net.
 *
 * Why this changed:
 *   - Three extra cross-origin requests (DNS + TLS handshake each) on
 *     top of the app's own JS, competing for bandwidth on slow
 *     connections right when the page is trying to become interactive.
 *   - No tree-shaking — the CDN build ships all of GSAP's plugins
 *     whether used or not. The npm import only bundles gsap core +
 *     the ScrollTrigger plugin actually used.
 *   - Counted by Lighthouse as "third-party code", and required
 *     `cdn.jsdelivr.net` + `unsafe-eval`/`unsafe-inline` in the CSP.
 *   - Self-hosting means the code is versioned, cached, and served
 *     from the same edge/CDN as the rest of the app.
 *
 * This component is kept as a harmless no-op so any stray import
 * elsewhere in the app doesn't break the build. It can be deleted
 * once nothing references it.
 * ─────────────────────────────────────────────────────────────
 */
export default function GsapScripts() {
  return null;
}
