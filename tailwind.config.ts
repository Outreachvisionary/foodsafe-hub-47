
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
        border: '#D1D5DB', // Light gray border for tables
        input: '#E5E7EB', // Slightly darker gray for input fields
        ring: '#2563EB', // Blue ring for focus states
        background: {
          light: '#FAFAFA', // Light background for sections
          dark: '#1F2937', // Dark background for headers or sidebars
          DEFAULT: '#FFFFFF', // Default white background
        },
        foreground: {
          light: '#374151', // Dark gray text for light backgrounds
          dark: '#E5E7EB', // Light gray text for dark backgrounds
          DEFAULT: '#333333', // Default darker gray for text
        },
        primary: {
          DEFAULT: '#2563EB', // Vibrant blue for primary elements
          dark: '#1E40AF',    // Deep navy blue for headers or CTAs
          light: '#93C5FD',   // Soft sky blue for hover states
          foreground: '#FFFFFF', // White text on primary buttons
        },
        secondary: {
          DEFAULT: '#F3F4F6', // Neutral gray for secondary elements
          foreground: '#374151', // Dark gray text for secondary buttons
        },
        destructive: {
          DEFAULT: '#EF4444', // Red for destructive actions or alerts
          foreground: '#FFFFFF', // White text on destructive buttons
        },
        accent: {
          DEFAULT: '#F59E0B',  // Bright amber for highlights or warnings
          light: '#FCD34D',    // Soft yellow for hover states
          dark: '#B45309',     // Deep amber for badges or emphasis
          foreground: '#FFFFFF', // White text on accent elements
        },
        success: {
          DEFAULT: '#10B981', // Vibrant green for success badges or statuses
          foreground: '#FFFFFF', // White text on success badges
        },
        warning: {
          DEFAULT: '#FFC107', // Yellow for warnings or caution badges
          foreground: '#333333', // Darker gray text on warning badges
        },
        info: {
          DEFAULT: '#0EA5E9', // Blue for informational badges or links
          foreground: '#FFFFFF', // White text on info badges
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        secondary: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'var(--colors-border)',
      },
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
  plugins: [
    require('tailwindcss-animate'),
  ],
} satisfies Config;

export default config;
