import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        walmart: {
          blue: "#0071CE",
          "blue-dark": "#004F9A",
          "blue-light": "#EBF4FC",
          navy: "#071B3A",
          "navy-dark": "#041026",
          yellow: "#FFC220",
          "yellow-dark": "#E5A800",
          "yellow-light": "#FFF9E6",
          surface: "#F4F8FC",
          muted: "#64748B",
          border: "#E2E8F0"
        }
      }
    }
  },
  plugins: []
};

export default config;
