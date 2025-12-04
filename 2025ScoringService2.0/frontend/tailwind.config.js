/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgb(var(--border) / 0.3)",
        input: "rgb(var(--input) / 0.3)",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          hover: "rgb(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground) / 0.7)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        risk: {
          critical: "rgb(var(--risk-critical))",
          high: "rgb(var(--risk-high))",
          medium: "rgb(var(--risk-medium))",
          low: "rgb(var(--risk-low))",
        },
        success: "rgb(var(--success))",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Berkeley Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'h1': ['30px', { lineHeight: '36px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h2': ['24px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h3': ['20px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h4': ['16px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'body-lg': ['16px', { lineHeight: '1.5' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'body-sm': ['12px', { lineHeight: '1.4' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        'sm': '6px',
        'base': '8px',
        'md': '10px',
        'lg': '12px',
        'full': '9999px',
        'DEFAULT': '8px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
        'inset-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-slow": "pulse-slow 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

