import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Gold
          light: '#E5C158',
          dark: '#B8941F',
        },
        secondary: {
          DEFAULT: '#1E3A5F', // Navy
          light: '#2B5280',
          dark: '#162942',
        },
        accent: {
          rose: '#F4C2C2',
          lavender: '#D4B5E6',
          mint: '#B5E6D4',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
