import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    extend: {
      fontFamily: {
        sans: ["'Everyday Sans'", "Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        background: "var(--color-bg-page)",
        foreground: "var(--color-text-primary)",
        brand: {
          primary: "var(--color-brand-primary)",
          "primary-hover": "var(--color-brand-primary-hover)",
          "primary-active": "var(--color-brand-primary-active)",
          secondary: "var(--color-brand-secondary)",
          yellow: "var(--color-brand-yellow)",
          "yellow-hover": "var(--color-brand-yellow-hover)",
          "yellow-light": "var(--color-brand-yellow-light)",
          bentonville: "var(--color-brand-bentonville)",
          everyday: "var(--color-brand-everyday)",
          sky: "var(--color-brand-sky)",
          navy: "var(--color-brand-navy)",
          "navy-dark": "var(--color-brand-navy-dark)",
          white: "var(--color-brand-white)"
        },
        surface: {
          DEFAULT: "var(--color-bg-surface)",
          page: "var(--color-bg-page)",
          subtle: "var(--color-bg-subtle)",
          muted: "var(--color-bg-muted)",
          elevated: "var(--color-bg-elevated)"
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)"
        },
        semantic: {
          success: "var(--color-success)",
          "success-bg": "var(--color-success-bg)",
          "success-border": "var(--color-success-border)",
          warning: "var(--color-warning)",
          "warning-bg": "var(--color-warning-bg)",
          "warning-border": "var(--color-warning-border)",
          danger: "var(--color-danger)",
          "danger-bg": "var(--color-danger-bg)",
          "danger-border": "var(--color-danger-border)",
          info: "var(--color-info)",
          "info-bg": "var(--color-info-bg)",
          "info-border": "var(--color-info-border)"
        },
        /* Backward compatibility with walmart-* utilities */
        walmart: {
          blue: "var(--color-brand-primary)",
          "blue-dark": "var(--color-brand-primary-hover)",
          "blue-light": "var(--color-brand-sky)",
          navy: "var(--color-brand-navy)",
          "navy-dark": "var(--color-brand-navy-dark)",
          yellow: "var(--color-brand-yellow)",
          "yellow-dark": "var(--color-brand-yellow-hover)",
          "yellow-light": "var(--color-brand-yellow-light)",
          surface: "var(--color-bg-page)",
          muted: "var(--color-text-muted)",
          border: "var(--color-border)"
        }
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)"
      },
      boxShadow: {
        none: "var(--shadow-none)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        overlay: "var(--shadow-overlay)",
        glass: "var(--shadow-glass)"
      },
      zIndex: {
        base: "0",
        sticky: "20",
        header: "30",
        dropdown: "40",
        popover: "50",
        drawer: "60",
        modal: "70",
        toast: "80"
      }
    }
  },
  plugins: []
};

export default config;
