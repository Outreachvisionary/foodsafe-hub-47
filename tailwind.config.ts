
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
        border: '#E2E8F0', // Refined light blue-gray border
        input: '#EDF2F7', // Lighter blue-gray for input fields
        ring: '#4A6FA5', // Steel blue for focus states
        background: {
          light: '#F8FAFC', // Off-white background for sections
          dark: '#2D3F63', // Deep navy for headers or sidebars
          DEFAULT: '#FFFFFF', // Default white background
        },
        foreground: {
          light: '#4A5568', // Medium blue-gray for lighter text
          dark: '#F8FAFC', // Off-white text for dark backgrounds
          DEFAULT: '#1A2333', // Near black for default text
        },
        primary: {
          DEFAULT: '#2D3F63', // Deep navy blue for primary elements
          dark: '#1A2333',    // Darker navy for emphasis
          light: '#4A6FA5',   // Steel blue for hover states
          foreground: '#FFFFFF', // White text on primary buttons
        },
        secondary: {
          DEFAULT: '#EDF2F7', // Light blue-gray for secondary elements
          foreground: '#2D3F63', // Deep navy text on secondary buttons
        },
        destructive: {
          DEFAULT: '#E53E3E', // Refined red for destructive actions
          foreground: '#FFFFFF', // White text on destructive buttons
        },
        accent: {
          DEFAULT: '#16BAC5',  // Turquoise for accents
          light: '#4FD1DB',    // Lighter turquoise for hover states
          dark: '#0E9AA7',     // Deeper turquoise for emphasis
          foreground: '#FFFFFF', // White text on accent elements
        },
        success: {
          DEFAULT: '#3CCF91', // Mint green for success indicators
          foreground: '#FFFFFF', // White text on success badges
        },
        warning: {
          DEFAULT: '#FF9F43', // Amber for warnings
          foreground: '#1A2333', // Near black text on warning badges
        },
        info: {
          DEFAULT: '#4A6FA5', // Steel blue for informational elements
          foreground: '#FFFFFF', // White text on info badges
        },
        muted: {
          DEFAULT: '#F1F5F9', // Light blue-gray for muted backgrounds
          foreground: '#64748B', // Medium blue-gray for muted text
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'], // Modern, professional sans-serif
        display: ['Satoshi', 'system-ui', 'sans-serif'], // Contemporary display font for headings
        mono: ['JetBrains Mono', 'monospace'], // Maintained for code sections
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
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
      }
    }
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
