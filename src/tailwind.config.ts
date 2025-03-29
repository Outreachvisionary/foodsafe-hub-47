
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
          DEFAULT: '#2E8B57', // Teal primary color
          dark: '#236744',    // Darker shade
          light: '#69B18E',   // Lighter shade
          foreground: '#FFFFFF', // White text for primary backgrounds
        },
        secondary: {
          DEFAULT: '#F5F5F5', // Light gray
          foreground: '#4A4A4A', // Charcoal gray for text
        },
        destructive: {
          DEFAULT: '#E63946', // Brighter red for destructive actions
          foreground: '#FFFFFF', // White text
        },
        muted: {
          DEFAULT: '#F9F9F9', // Very light gray
          foreground: '#6C757D', // Medium gray for muted text
        },
        accent: {
          DEFAULT: '#2E8B57',  // Teal (same as primary)
          light: '#69B18E',    // Lighter teal
          dark: '#236744',     // Darker teal
          foreground: '#FFFFFF', // White text on accent backgrounds
        },
        warning: {
          DEFAULT: '#FFC107', // Yellow for warnings
          foreground: '#4A4A4A', // Dark text for contrast
        },
        success: {
          DEFAULT: '#2E8B57', // Teal for success
          foreground: '#FFFFFF', // White text
        },
        info: {
          DEFAULT: '#0EA5E9', // Blue for info
          foreground: '#FFFFFF', // White text
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
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
