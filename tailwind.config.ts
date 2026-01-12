import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode primary (gold)
        primary: {
          DEFAULT: '#D4AF37',
          light: '#E5C158',
          dark: '#B8941F',
        },
        // Dark mode primary (cyan tints)
        'primary-dm': {
          DEFAULT: '#2aa6c2',
          '10': '#2aa6c2',
          '20': '#4fb0c9',
          '30': '#6bbacf',
          '40': '#82c3d6',
          '50': '#99cddd',
          '60': '#aed7e4',
        },
        secondary: {
          DEFAULT: '#1E3A5F',
          light: '#2B5280',
          dark: '#162942',
        },
        accent: {
          rose: '#F4C2C2',
          lavender: '#D4B5E6',
          mint: '#B5E6D4',
        },
        // Dark mode surface colors
        surface: {
          DEFAULT: '#121212',
          '10': '#121212',
          '20': '#282828',
          '30': '#3f3f3f',
          '40': '#575757',
          '50': '#717171',
          '60': '#8b8b8b',
        },
        // Dark mode tonal surface colors
        tonal: {
          DEFAULT: '#181f21',
          '10': '#181f21',
          '20': '#2d3436',
          '30': '#444a4c',
          '40': '#5c6163',
          '50': '#75797b',
          '60': '#8f9394',
        },
        // Semantic colors
        success: {
          DEFAULT: '#22946e',
          '10': '#22946e',
          '20': '#47d5a6',
          '30': '#9ae8ce',
        },
        warning: {
          DEFAULT: '#a87a2a',
          '10': '#a87a2a',
          '20': '#d7ac61',
          '30': '#ecd7b2',
        },
        danger: {
          DEFAULT: '#9c2121',
          '10': '#9c2121',
          '20': '#d94a4a',
          '30': '#eb9e9e',
        },
        info: {
          DEFAULT: '#21498a',
          '10': '#21498a',
          '20': '#4077d1',
          '30': '#92b2e5',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
