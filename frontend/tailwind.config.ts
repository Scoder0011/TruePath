import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ink-deep": "#080B12",// slightly darker than ink — used as the base page background behind the glass cards
        ink: "#0E1420",       // primary dark background
        "ink-line": "#263042", // borders/dividers on dark bg
        "ink-soft": "#8A94A6", // secondary text on dark bg
        paper: "#F6F4EE",      // light alt-section background
        "paper-line": "#DEDACD",
        amber: "#E8A33D",      // "in progress" accent — use sparingly
        route: "#4FA97F",      // "complete" accent
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
