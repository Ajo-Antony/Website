import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mint: "#D8E8E5",
        teal: "#0A5C68",
        "teal-light": "#0e7a8a",
        "site-dark": "#0F172A",
        muted: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "30px",
      },
    },
  },
  plugins: [],
};

export default config;
