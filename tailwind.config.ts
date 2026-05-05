import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 28px 80px rgba(18, 17, 14, 0.14)",
        glow: "0 0 0 1px rgba(255,255,255,0.05), 0 0 60px rgba(255,91,47,0.25)",
      },
      letterSpacing: {
        signal: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
