import type { Config } from "tailwindcss";

// Design tokens extracted directly from the "Cybernetic Forge" Stitch design system
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surface hierarchy: nested layers of frosted charcoal
        "surface-container-lowest": "#0d0e12",
        "surface-container-low": "#1a1b20",
        "surface-container": "#1f1f24",
        "surface-container-high": "#292a2e",
        "surface-container-highest": "#343439",
        surface: "#121317",
        "surface-dim": "#121317",
        "surface-bright": "#38393e",
        "surface-variant": "#343439",
        "surface-tint": "#e5b5ff",

        // Background
        background: "#121317",
        "on-background": "#e3e2e8",

        // Primary: neon purple spectrum
        primary: "#e5b5ff",           // Light purple — text on dark
        "primary-container": "#b026ff", // Rich purple — CTA gradient
        "primary-fixed": "#f4d9ff",
        "primary-fixed-dim": "#e5b5ff",
        "on-primary": "#4e0078",
        "on-primary-container": "#fffdff",
        "on-primary-fixed": "#30004b",
        "on-primary-fixed-variant": "#7000a8",
        "inverse-primary": "#9200db",

        // Secondary: cyber green
        secondary: "#f5fff4",
        "secondary-container": "#16ff9e", // Active chip "LED" green
        "secondary-fixed": "#56ffa8",
        "secondary-fixed-dim": "#00e38b",
        "on-secondary": "#00391f",
        "on-secondary-container": "#007243",
        "on-secondary-fixed": "#002110",
        "on-secondary-fixed-variant": "#00522f",

        // Tertiary: muted blue-slate
        tertiary: "#bdc7d9",
        "tertiary-container": "#6c7687",
        "tertiary-fixed": "#d9e3f6",
        "tertiary-fixed-dim": "#bdc7d9",
        "on-tertiary": "#27313f",
        "on-tertiary-container": "#fffdff",
        "on-tertiary-fixed": "#121c2a",
        "on-tertiary-fixed-variant": "#3d4756",

        // On-surface
        "on-surface": "#e3e2e8",
        "on-surface-variant": "#d2c1d7",
        "inverse-surface": "#e3e2e8",
        "inverse-on-surface": "#2f3035",

        // Outlines
        outline: "#9b8ba1",
        "outline-variant": "#4f4255",

        // Error
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        // Design system uses generous rounding for premium feel
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        // Primary CTA gradient: luminous neon purple glow
        "gradient-primary": "linear-gradient(135deg, #e5b5ff 0%, #b026ff 100%)",
        // Radial ambient gradients for hero sections
        "gradient-hero":
          "radial-gradient(circle at top right, rgba(176,38,255,0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(86,255,168,0.05), transparent 40%)",
      },
      boxShadow: {
        // Tinted shadow: primary color at 6% opacity, 40px blur, 20px Y offset
        primary: "0 20px 40px rgba(176, 38, 255, 0.06)",
        "primary-md": "0 10px 30px rgba(176, 38, 255, 0.15)",
        "primary-lg": "0 20px 40px rgba(229, 181, 255, 0.15)",
        "green-glow": "0 0 20px rgba(22, 255, 158, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
