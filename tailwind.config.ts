import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#d9ede4',
          200: '#b5dcce',
          300: '#87c3af',
          400: '#5da68f',
          500: '#3b8a73',
          600: '#2b6e5b',
          700: '#225749',
          800: '#1b453b',
          900: '#0B3D2E', // REKSA Deep Forest Green
          950: '#05241b',
        },
        ochre: {
          50: '#fdfbf6',
          100: '#fbf5ea',
          200: '#f5e7cc',
          300: '#edd4a7',
          400: '#e4bd7d',
          500: '#D4A24C', // REKSA Warm Gold / Ochre
          600: '#bf8b3b',
          700: '#9f6e2e',
          800: '#7f5427',
          900: '#684523',
          950: '#3a2410',
        },
        canvas: {
          50: '#ffffff',
          100: '#FAF8F4', // REKSA Warm Off-White
          200: '#f4efe6',
          300: '#ebe2d4',
          400: '#ded1be',
          500: '#cdbda6',
        },
        charcoal: {
          50: '#f2f5f4',
          100: '#e1e7e4',
          200: '#c1cdc7',
          300: '#9aaca3',
          400: '#73897f',
          500: '#53685e',
          600: '#3f5049',
          700: '#313f39',
          800: '#222d28',
          900: '#14231C', // REKSA Charcoal Dark Base
          950: '#0a120e',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#080d1a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        'premium': '0 20px 25px -5px rgba(6, 78, 59, 0.08), 0 8px 10px -6px rgba(6, 78, 59, 0.08)',
        'dock': '0 10px 30px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      transitionDuration: {
        'micro': '240ms',
        'standard': '420ms',
        'medium': '600ms',
        'hero': '950ms',
        'cinematic': '1600ms',
      },
      transitionTimingFunction: {
        'smart-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'smart-spring': 'cubic-bezier(0.18, 0.89, 0.32, 1.02)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-up': 'fadeUp 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-down': 'fadeDown 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-down': 'slideDown 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 2.4s linear infinite',
        'pulse-subtle': 'pulseSubtle 2.8s ease-in-out infinite',
        'ken-burns': 'kenBurns 9s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      }
    },
  },
  plugins: [],
};
export default config;
