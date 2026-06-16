import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette from Strixmind Identity & Branding PDF
        "brand-blue":      "#0063E5",
        "brand-deep":      "#003E8F",
        "brand-light":     "#6aabff",
        "brand-black":     "#212121",
        "site-dark":       "#051A1C",
        "site-text":       "#0F172A",
        "site-muted":      "#64748B",
        "site-border":     "#E5E7EB",
        "section-alt":     "#EEF4FF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "30px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0063E5 0%, #003E8F 100%)",
        "grid-faint": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
