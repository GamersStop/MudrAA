import type { Config } from "tailwindcss";

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
        void: "#06070A",
        primary: "#F59E0B",
        "primary-light": "#FCD34D",
        violet: "#9945FF",
        cyan: "#00F2FE",
        green: "#14F195",
        charcoal: "#111318",
        surface: "rgba(17, 19, 24, 0.75)",
        "on-surface-variant": "#94A3B8",
        mudraa: {
          obsidian: "#06070A",
          dark: "#0A0C14",
          card: "#101322",
          "card-hover": "#161B30",
          border: "#1C233D",
          "border-bright": "#2D375E",
          purple: "#9945FF",
          "purple-light": "#B46EFF",
          "purple-dark": "#7023C4",
          cyan: "#00F2FE",
          "cyan-glow": "#38E1FF",
          green: "#14F195",
          gold: "#F59E0B",
          "gold-light": "#FCD34D",
          "gold-dark": "#B45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        headline: ["var(--font-playfair)", "var(--font-cinzel)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "var(--font-cinzel)", "Georgia", "serif"],
        serif: ["var(--font-playfair)", "var(--font-cinzel)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        devanagari: ["var(--font-devanagari)", "serif"],
        label: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-reverse": "float-reverse 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "scan-line": "scan-line 6s linear infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
      boxShadow: {
        "neon-purple": "0 0 28px rgba(153, 69, 255, 0.35)",
        "neon-cyan": "0 0 28px rgba(0, 242, 254, 0.35)",
        "neon-green": "0 0 24px rgba(20, 241, 149, 0.3)",
        "neon-solana": "0 0 40px rgba(153, 69, 255, 0.25), 0 0 80px rgba(20, 241, 149, 0.12)",
        "neon-gold": "0 0 28px rgba(245, 158, 11, 0.28)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
