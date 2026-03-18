import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neural-bg": "#030014",
        "neural-surface": "#0d0a2e",
        "neural-border": "#1e1b4b",
        "neural-muted": "#6b7280",
        "neural-cyan": "#00d4ff",
        "neural-purple": "#7c3aed",
        "neural-green": "#22c55e",
        "neural-amber": "#f59e0b",
      },
    },
  },
  plugins: [],
};
export default config;
