
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
        // Light theme color system
        border: {
          DEFAULT: '#E5E7EB',
          medium: '#D1D5DB',
        },
        input: '#D1D5DB',
        ring: '#1E4D8C',
        background: '#F9FAFC',
        foreground: '#102A43',
        primary: {
          DEFAULT: '#1E4D8C',  // Primary blue
          dark: '#15325E',    
          light: '#4799FF',   
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F0F4F8',  // Secondary background
          foreground: '#486581',
        },
        destructive: {
          DEFAULT: '#EF4444',  // Error red
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F0F4F8',
          foreground: '#829AB1',
        },
        accent: {
          DEFAULT: '#D5A021',  // Gold accent
          light: '#F3CF71',  
          dark: '#B2851C',   
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#102A43',
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'system-ui', 'sans-serif'],
        secondary: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Rest of your theme configurations...
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: theme('colors.border', 'currentColor'),
      }),
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
  // Enable arbitrary values for certain utilities
  plugins: [
    require('tailwindcss-animate'),
    // Optional: Add plugin to make opacity modifiers work with arbitrary colors
    require('@tailwindcss/plugin-custom-colors')
  ],
} satisfies Config;

export default config;
