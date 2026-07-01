import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── shadcn-style semantic tokens, mapped to StrixMind's own
        // CSS variables (globals.css) instead of generic gray — keeps
        // imported components (ui/aurora-background, ui/display-cards,
        // ui/expandable-tabs, ui/scroll-reel-testimonials) on-brand.
        background: "var(--surface)",
        foreground: "var(--text)",
        card: "var(--surface)",
        "card-foreground": "var(--text)",
        muted: "var(--surface-alt)",
        "muted-foreground": "var(--text-muted)",
        border: "var(--border)",
        ring: "var(--accent)",
        primary: "var(--accent)",
        "primary-foreground": "#ffffff",
        secondary: "var(--surface-alt)",
        "secondary-foreground": "var(--text)",
        // ── Unified StrixMind palette ──
        // Single source of truth — used by every page incl. /work and /admin.
        // Every token below resolves to a CSS variable from globals.css, so
        // it automatically follows whichever theme (`data-theme="dark"` or
        // `"light"`) is active on <html> — no per-page light/dark branching
        // needed in component code.
        ink:        "var(--text)",
        "ink-soft": "var(--text-muted)",
        "ink-dim":  "var(--text-dim)",
        accent:        "var(--accent)",
        "accent-2":    "var(--accent-2)",
        "accent-deep": "var(--accent-deep)",
        teal:          "var(--accent-teal)",
        rose:          "var(--accent-rose)",
        amber:         "var(--accent-amber)",
        "surface-alt": "var(--surface-alt)",
        line:          "var(--divider)",

        // Legacy keys kept so existing className strings (about/services/
        // contact/booking + /work + /admin pages) keep working — remapped
        // to the same CSS variables above so they stay theme-aware too.
        "brand-blue":  "var(--accent)",
        "brand-deep":  "var(--accent-deep)",
        "brand-light": "var(--accent-2)",
        "brand-black": "var(--text)",
        "site-dark":   "var(--text)",
        "site-text":   "var(--text)",
        "site-muted":  "var(--text-muted)",
        "site-border": "var(--border)",
        "section-alt": "var(--surface-alt)",

        "work-lime":  "var(--accent)",
        "work-dark":  "var(--text)",
        "work-gray":  "var(--surface-alt)",
        "work-line":  "var(--border)",
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
        "brand-gradient": "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
        "accent-gradient": "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
        "grid-faint": "linear-gradient(var(--divider) 1px, transparent 1px), linear-gradient(90deg, var(--divider) 1px, transparent 1px)",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), addVariablesForColors],
};

// Exposes every Tailwind color as a CSS var (e.g. var(--blue-500)) —
// required by ui/aurora-background's gradient-band animation.
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ":root": newVars });
}

export default config;
