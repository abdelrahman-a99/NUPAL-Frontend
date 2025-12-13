import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        nupal: {
          50: '#F0F9FF',
          100: '#E6F4FF',
          300: '#7FC7FF',
          400: '#4EC1FF',
          500: '#2F80ED',
          600: '#1F5FB6',
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      },
      keyframes: {
        waveFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        waveFloat: 'waveFloat 6s ease-in-out infinite',
      },
    }
  }
} satisfies Config;
