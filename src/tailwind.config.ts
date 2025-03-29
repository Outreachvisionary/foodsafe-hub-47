
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1E4D8C', // Professional blue
          dark: '#15325E',    // Darker shade
          light: '#4799FF',   // Lighter shade
          foreground: '#FFFFFF', // White text for primary backgrounds
        },
        secondary: {
          DEFAULT: '#F0F4F8',
          foreground: '#222222', // Darkened for better contrast on light backgrounds
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: '#555555', // Darkened for better contrast
        },
        accent: {
          DEFAULT: '#D5A021',  // Refined gold
          light: '#F3CF71',    // Lighter gold
          dark: '#B2851C',     // Darker gold
          foreground: '#222222', // Dark text on accent backgrounds
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        secondary: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      // This enables opacity modifiers for border colors
      borderOpacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
      },
    },
  },
  // Enable animation
  plugins: [
    require('tailwindcss-animate'),
  ],
} satisfies Config;

export default config;
