/**
 * src/lib/utils/site-url.ts
 * ─────────────────────────────────────────────────────────────
 * Resolves the canonical site origin so OAuth + email-confirmation
 * redirects land on the right domain in every environment:
 *   1. NEXT_PUBLIC_SITE_URL  — set this in Vercel → Production env vars
 *      to your real domain, e.g. https://strixmind.ai
 *   2. VERCEL_URL            — auto-set by Vercel on preview deployments
 *      (no protocol, so we prefix https://)
 *   3. http://localhost:3000 — local dev fallback
 */
export function getURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}
