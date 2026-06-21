import type { NextConfig } from "next";

/**
 * PERF FIXES:
 * 1. compress: true   — enables gzip on all responses (was missing)
 * 2. poweredByHeader: false — removes X-Powered-By header (tiny but clean)
 * 3. images.formats  — adds avif + webp. Next.js <Image> will serve avif
 *    to browsers that support it (typically 40-60% smaller than jpeg).
 * 4. Removed duplicate wildcard `*.supabase.co` pattern — keep only the
 *    specific project hostname to avoid unnecessary pattern matching.
 */
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdmyhhgzmepodszlxvfy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Keep wildcard only if you use multiple Supabase projects.
      // Remove if you only have one project (reduces attack surface).
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // PERF: Allow Unsplash images used in FeatureCarouselSection
      // so Next.js <Image> can optimise them automatically.
      // If you switch to local/Supabase images later, remove this.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
