import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Unified StrixMind palette (Light Premium Glass) ──
        // Single source of truth — used by every page incl. /work and /admin.
        ink:        "#1a1333",
        "ink-soft": "#5b5478",
        "ink-dim":  "#9b92c0",
        accent:        "#6c63ff",
        "accent-2":    "#a78bfa",
        "accent-deep": "#4c46c4",
        teal:          "#0ea5e9",
        rose:          "#f472b6",
        amber:         "#f59e0b",
        "surface-alt": "#f3f1ff",
        line:          "#E5E0FA",

        // Legacy keys kept so existing className strings (about/services/
        // contact/booking + /work + /admin pages) keep working — remapped
        // to the unified palette above instead of the old teal/lime/navy.
        "brand-blue":  "#6c63ff",
        "brand-deep":  "#4c46c4",
        "brand-light": "#a78bfa",
        "brand-black": "#1a1333",
        "site-dark":   "#1a1333",
        "site-text":   "#1a1333",
        "site-muted":  "#5b5478",
        "site-border": "#E5E0FA",
        "section-alt": "#f3f1ff",

        "work-lime":  "#6c63ff",
        "work-dark":  "#1a1333",
        "work-gray":  "#f3f1ff",
        "work-line":  "#E5E0FA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        work: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "30px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
        "accent-gradient": "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
        "grid-faint": "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
