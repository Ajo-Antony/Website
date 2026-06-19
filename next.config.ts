import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdmyhhgzmepodszlxvfy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Allow any other Supabase project URLs (for flexibility)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
